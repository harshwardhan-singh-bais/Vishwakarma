import json
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