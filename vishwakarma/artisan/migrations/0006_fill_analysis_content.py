from django.db import migrations

def fill_analysis_content(apps, schema_editor):
    Project = apps.get_model('artisan', 'Project')
    analysis_data = [
        {
            "title": "Target Market Analysis",
            "content": "Based on your target market, we've identified 3 key customer segments with high growth potential. The primary segment (45%) consists of millennials aged 25-35 with disposable income. Secondary segment (30%) includes Gen-Z consumers who prioritize sustainability.",
            "chartType": "pie",
            "chartData": {
                "labels": ['Millennials (25-35)', 'Gen-Z (18-24)', 'Gen-X (36-50)'],
                "data": [45, 30, 25],
                "colors": ['#1FB8CD', '#FFC185', '#B4413C']
            }
        },
        {
            "title": "Product Portfolio Analysis",
            "content": "Your product mix shows strong diversity across 3 categories. Premium products contribute 60% of revenue despite being 20% of volume. Consider expanding premium line based on market demand.",
            "chartType": "bar",
            "chartData": {
                "labels": ['Premium', 'Mid-range', 'Budget'],
                "data": [60, 25, 15],
                "colors": ['#1FB8CD', '#FFC185', '#B4413C']
            }
        },
        {
            "title": "Marketing Strategy Assessment",
            "content": "Current marketing channels show Instagram leading with 40% engagement, followed by Facebook at 30%. YouTube content marketing shows 3x higher conversion rates. Recommend increasing video content budget by 25%.",
            "chartType": "line",
            "chartData": {
                "labels": ['Instagram', 'Facebook', 'YouTube', 'Google Ads'],
                "data": [40, 30, 20, 10],
                "colors": ['#1FB8CD']
            }
        },
        {
            "title": "Challenge Priority Matrix",
            "content": "Main challenges ranked by impact and urgency. Supply chain optimization ranks highest priority. Digital transformation and customer retention follow. Recommend addressing top 3 challenges in Q1 2025.",
            "chartType": "bar",
            "chartData": {
                "labels": ['Supply Chain', 'Digital Transform', 'Customer Retention', 'Competition', 'Funding'],
                "data": [85, 75, 70, 60, 45],
                "colors": ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
            }
        },
        {
            "title": "Growth Projection Analysis",
            "content": "12-month growth targets are achievable with 73% confidence based on market trends. Revenue projection shows 35% YoY growth potential. Key milestones include Q1 product launch, Q2 market expansion, Q3 scaling operations.",
            "chartType": "line",
            "chartData": {
                "labels": ['Q1', 'Q2', 'Q3', 'Q4'],
                "data": [15, 25, 35, 45],
                "colors": ['#1FB8CD']
            }
        }
    ]
    for project in Project.objects.all():
        project.analysis_content = analysis_data
        project.save()

class Migration(migrations.Migration):

    dependencies = [
    ('artisan', '0005_project_analysis_content'),
]


    operations = [
        migrations.RunPython(fill_analysis_content),
    ]