import json
import random
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_date
from .models import Project

def home(request):
    return render(request, 'artisan/index.html')


def project_to_dict(project: Project) -> dict:
    return {
        "id": project.id,
        "name": project.name,
        "type": project.type,
        "description": project.description,
        "created_date": project.created_date.isoformat(),
        "questions_answered": project.questions_answered,
        "answers": project.answers,
        "charts": project.charts,
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
        description = payload.get('description') or ''
        answers = payload.get('answers') or []
        charts = payload.get('charts') or {}

        if not name:
            return JsonResponse({"error": "'name' is required"}, status=400)
        if project_type not in dict(Project.PROJECT_TYPE_CHOICES):
            return JsonResponse({"error": "'type' must be one of the allowed choices"}, status=400)

        project = Project.objects.create(
            name=name,
            type=project_type,
            description=description,
            questions_answered=bool(answers),
            answers=answers,
            charts=charts if isinstance(charts, dict) else {},
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
        description = payload.get('description')
        answers = payload.get('answers')
        charts = payload.get('charts')
        questions_answered = payload.get('questions_answered')
        created_date = payload.get('created_date')

        if name is not None:
            project.name = str(name).strip()
        if project_type is not None:
            if project_type not in dict(Project.PROJECT_TYPE_CHOICES):
                return JsonResponse({"error": "'type' must be one of the allowed choices"}, status=400)
            project.type = project_type
        if description is not None:
            project.description = description or ''
        if answers is not None:
            project.answers = list(answers)
            project.questions_answered = bool(project.answers)
        if charts is not None:
            # Accept only dict-like charts payloads
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
            # Generate random data that sums to 100 for pie, or random for bar
            if len(labels) > 1:
                values = [random.randint(10, 60) for _ in labels]
                if sum(values) > 0:
                    # Normalize to sum to 100 for pie charts
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
        # ...add more logic for other questions...
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
        # Generate random statistics data
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