import json
import random
import os
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_date
from .models import Project, ApiKeys

# --- NEW IMPORTS FOR GEMINI + LANGCHAIN ---
import google.generativeai as genai
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def home(request):
    return render(request, 'artisan/index.html')

def project_to_dict(project: Project) -> dict:
    return {
        "id": project.id,
        "name": project.name,
        "type": project.type,
        "created_date": project.created_date.isoformat(),
        "questions_answered": project.questions_answered,
        "answers": project.answers,
        "charts": project.charts,
        "analysis_content": project.analysis_content,
    }

@csrf_exempt
def api_projects(request: HttpRequest):
    if request.method == 'GET':
        projects = [project_to_dict(p) for p in Project.objects.all()]
        return JsonResponse({"results": projects}, status=200)

    if request.method == 'POST':
        try:
            payload = json.loads(request.body.decode('utf-8')) if request.body else {}
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        name = (payload.get('name') or '').strip()
        project_type = payload.get('type')
        answers = payload.get('answers') or []
        charts = payload.get('charts') or {}
        analysis_content = payload.get('analysis_content', '')

        if not name:
            return JsonResponse({"error": "'name' is required"}, status=400)
        if project_type not in dict(Project.PROJECT_TYPE_CHOICES):
            return JsonResponse({"error": "'type' must be one of the allowed choices"}, status=400)

        project = Project.objects.create(
            name=name,
            type=project_type,
            questions_answered=bool(answers),
            answers=answers,
            charts=charts if isinstance(charts, dict) else {},
            analysis_content=analysis_content,
        )
        return JsonResponse(project_to_dict(project), status=201)

    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def api_project_detail(request: HttpRequest, project_id: int):
    project = get_object_or_404(Project, pk=project_id)

    if request.method == 'GET':
        return JsonResponse(project_to_dict(project), status=200)

    if request.method in ['PUT', 'PATCH']:
        try:
            payload = json.loads(request.body.decode('utf-8')) if request.body else {}
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        name = payload.get('name')
        project_type = payload.get('type')
        answers = payload.get('answers')
        charts = payload.get('charts')
        questions_answered = payload.get('questions_answered')
        created_date = payload.get('created_date')
        analysis_content = payload.get('analysis_content')

        if name is not None:
            project.name = str(name).strip()
        if project_type is not None:
            if project_type not in dict(Project.PROJECT_TYPE_CHOICES):
                return JsonResponse({"error": "'type' must be one of the allowed choices"}, status=400)
            project.type = project_type
        if answers is not None:
            project.answers = list(answers)
            project.questions_answered = bool(project.answers)
        if charts is not None:
            try:
                charts_obj = dict(charts)
            except Exception:
                return JsonResponse({"error": "'charts' must be an object"}, status=400)
            project.charts = charts_obj
        if questions_answered is not None:
            project.questions_answered = bool(questions_answered)
        if created_date is not None:
            dt = parse_date(created_date)
            if dt is None:
                return JsonResponse({"error": "'created_date' must be YYYY-MM-DD"}, status=400)
            project.created_date = dt
        if analysis_content is not None:
            project.analysis_content = str(analysis_content)

        project.save()
        return JsonResponse(project_to_dict(project), status=200)

    if request.method == 'DELETE':
        project.delete()
        return JsonResponse({"success": True}, status=200)

    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def analysis_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        question_index = data.get('question_index')
        answer = data.get('answer')
        previous_answers = data.get('previous_answers', [])

        def random_chart_data(labels):
            if len(labels) > 1:
                values = [random.randint(10, 60) for _ in labels]
                if sum(values) > 0:
                    total = sum(values)
                    values = [int(v * 100 / total) for v in values]
            else:
                values = [random.randint(10, 100)]
            return values

        if question_index == 0:
            labels = ['Segment A', 'Segment B', 'Segment C']
            analysis = {
                "title": "Target Market Analysis",
                "content": f"Custom analysis for answer: {answer}",
                "chartType": "pie",
                "chartData": {
                    "labels": labels,
                    "data": random_chart_data(labels),
                    "colors": ['#1FB8CD', '#FFC185', '#B4413C']
                },
                "reply": "Based on your target market, focus on Segment A for highest growth potential."
            }
        elif question_index == 1:
            labels = ['Premium', 'Mid-range', 'Budget']
            analysis = {
                "title": "Product Portfolio Analysis",
                "content": f"Custom analysis for products: {answer}",
                "chartType": "bar",
                "chartData": {
                    "labels": labels,
                    "data": random_chart_data(labels),
                    "colors": ['#1FB8CD', '#FFC185', '#B4413C']
                },
                "reply": "Consider expanding your premium product line to boost revenue."
            }
        else:
            labels = ['A', 'B', 'C']
            analysis = {
                "title": "Generic Analysis",
                "content": "No specific analysis available.",
                "chartType": "bar",
                "chartData": {
                    "labels": labels,
                    "data": random_chart_data(labels),
                    "colors": ['#1FB8CD', '#FFC185', '#B4413C']
                },
                "reply": "Let me know if you need more insights on this topic."
            }
        return JsonResponse(analysis)
    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def statistics_view(request):
    if request.method == 'GET':
        stats = {
            "sales": {
                "revenue": [random.randint(100000, 200000) for _ in range(6)],
                "months": ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
                "products": [
                    {"name": "Premium Collection", "sales": random.randint(50000, 80000), "growth": f"+{random.randint(5,15)}%"},
                    {"name": "Classic Line", "sales": random.randint(30000, 60000), "growth": f"+{random.randint(5,15)}%"},
                    {"name": "Budget Series", "sales": random.randint(15000, 35000), "growth": f"+{random.randint(5,15)}%"}
                ]
            },
            "marketing": {
                "platforms": [
                    {"name": "Instagram", "reach": random.randint(40000, 50000), "engagement": f"{random.uniform(7,10):.1f}%", "conversion": f"{random.uniform(2,3):.1f}%"},
                    {"name": "YouTube", "reach": random.randint(20000, 30000), "engagement": f"{random.uniform(10,14):.1f}%", "conversion": f"{random.uniform(3,5):.1f}%"},
                    {"name": "Facebook", "reach": random.randint(30000, 40000), "engagement": f"{random.uniform(5,7):.1f}%", "conversion": f"{random.uniform(1,2):.1f}%"}
                ],
                "campaigns": [
                    {"name": "Summer Collection", "roi": random.randint(250, 400), "spent": random.randint(10000, 20000), "revenue": random.randint(30000, 60000)},
                    {"name": "Festive Special", "roi": random.randint(200, 350), "spent": random.randint(10000, 18000), "revenue": random.randint(25000, 50000)}
                ]
            },
            "customerSegments": {
                "ageGroups": [
                    {"range": "18-25", "percentage": random.randint(20, 30), "value": random.randint(30000, 40000)},
                    {"range": "26-35", "percentage": random.randint(40, 50), "value": random.randint(60000, 80000)},
                    {"range": "36-50", "percentage": random.randint(25, 35), "value": random.randint(40000, 50000)}
                ],
                "gender": [
                    {"type": "Female", "percentage": random.randint(60, 70), "value": random.randint(90000, 110000)},
                    {"type": "Male", "percentage": random.randint(30, 40), "value": random.randint(40000, 60000)}
                ]
            }
        }
        return JsonResponse(stats)
    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def api_keys_view(request):
    if request.method == 'GET':
        keys, _ = ApiKeys.objects.get_or_create(id=1)
        return JsonResponse({
            'instagram': keys.instagram or '',
            'youtube': keys.youtube or '',
            'flipkart': keys.flipkart or ''
        })
    if request.method == 'POST':
        data = json.loads(request.body)
        keys, _ = ApiKeys.objects.get_or_create(id=1)
        keys.instagram = data.get('instagram', '')
        keys.youtube = data.get('youtube', '')
        keys.flipkart = data.get('flipkart', '')
        keys.save()
        return JsonResponse({'success': True})
    return JsonResponse({'error': 'Invalid request'}, status=400)

# --- NEW CHATBOT VIEW WITH GEMINI ---
def get_database_context():
    """Fetch and format all project data from database"""
    projects = Project.objects.all()
    context_parts = []
    
    for project in projects:
        project_info = f"""
Project: {project.name}
Type: {project.type}
Created: {project.created_date}
Questions Answered: {'Yes' if project.questions_answered else 'No'}
"""
        
        if project.answers:
            project_info += "Answers:\n"
            for i, answer in enumerate(project.answers, 1):
                project_info += f"  {i}. {answer}\n"
        
        if project.analysis_content:
            project_info += f"Analysis: {project.analysis_content}\n"
            
        context_parts.append(project_info)
    
    return "\n---\n".join(context_parts) if context_parts else "No projects found in database."

@csrf_exempt
def chatbot_view(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
    try:
        data = json.loads(request.body)
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return JsonResponse({"error": "Message is required"}, status=400)
        
        if not GEMINI_API_KEY:
            return JsonResponse({"error": "Gemini API key not configured"}, status=500)
        
        # Get context from database
        db_context = get_database_context()
        
        # Create the prompt
        system_prompt = """You are a helpful business assistant for Vishwakarma platform. 
You have access to project data from the database. Answer user questions based on this data.
Be conversational, helpful, and provide insights based on the project information available.

Available Project Data:
{}

Instructions:
- Answer questions based only on the provided project data
- If asked about something not in the data, politely say you don't have that information
- Provide actionable business insights when possible
- Keep responses concise but informative
""".format(db_context)

        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Generate response
        prompt = f"{system_prompt}\n\nUser Question: {user_message}"
        response = model.generate_content(prompt)
        
        return JsonResponse({
            "reply": response.text,
            "context_used": len(Project.objects.all())
        })
        
    except Exception as e:
        return JsonResponse({"error": f"Failed to generate response: {str(e)}"}, status=500)

        # Add this to your views.py temporarily for debugging:

@csrf_exempt 
def test_gemini_view(request):
    """Test endpoint to verify Gemini API is working"""
    try:
        import google.generativeai as genai
        
        GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
        if not GEMINI_API_KEY:
            return JsonResponse({"error": "No Gemini API key found"}, status=500)
            
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        response = model.generate_content("Say hello")
        
        return JsonResponse({
            "success": True,
            "response": response.text,
            "api_key_length": len(GEMINI_API_KEY)
        })
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# And add this to your urls.py:
# path('api/test-gemini/', views.test_gemini_view, name='test_gemini'),