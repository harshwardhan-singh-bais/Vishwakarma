// Global app variable
let app;

// Application Data and State Management
class VishwakarmaApp {
    constructor() {
        this.currentView = 'dashboard';
        this.currentProject = null;
        this.currentSegment = 'description';
        this.currentQuestionIndex = 0;
        this.questionAnswers = [];
        this.newProject = {};
        this.apiKeysSetup = false;
        this.customApiKeys = [];
        this.chatHistory = [];
        
        // Data from backend
        this.projects = [];

        this.questions = [
            "What is your target market and customer base?",
            "What are your main products or services?", 
            "What is your current marketing strategy?",
            "What are your main business challenges?",
            "What are your growth objectives for the next 12 months?"
        ];

        this.analysisData = [
            {
                title: "Target Market Analysis", 
                content: "Based on your target market, we've identified 3 key customer segments with high growth potential. The primary segment (45%) consists of millennials aged 25-35 with disposable income. Secondary segment (30%) includes Gen-Z consumers who prioritize sustainability.",
                chartType: "pie",
                chartData: {
                    labels: ['Millennials (25-35)', 'Gen-Z (18-24)', 'Gen-X (36-50)'],
                    data: [45, 30, 25],
                    colors: ['#1FB8CD', '#FFC185', '#B4413C']
                }
            },
            {
                title: "Product Portfolio Analysis",
                content: "Your product mix shows strong diversity across 3 categories. Premium products contribute 60% of revenue despite being 20% of volume. Consider expanding premium line based on market demand.",
                chartType: "bar", 
                chartData: {
                    labels: ['Premium', 'Mid-range', 'Budget'],
                    data: [60, 25, 15],
                    colors: ['#1FB8CD', '#FFC185', '#B4413C']
                }
            },
            {
                title: "Marketing Strategy Assessment", 
                content: "Current marketing channels show Instagram leading with 40% engagement, followed by Facebook at 30%. YouTube content marketing shows 3x higher conversion rates. Recommend increasing video content budget by 25%.",
                chartType: "line",
                chartData: {
                    labels: ['Instagram', 'Facebook', 'YouTube', 'Google Ads'],
                    data: [40, 30, 20, 10],
                    colors: ['#1FB8CD']
                }
            },
            {
                title: "Challenge Priority Matrix",
                content: "Main challenges ranked by impact and urgency. Supply chain optimization ranks highest priority. Digital transformation and customer retention follow. Recommend addressing top 3 challenges in Q1 2025.",
                chartType: "bar",
                chartData: {
                    labels: ['Supply Chain', 'Digital Transform', 'Customer Retention', 'Competition', 'Funding'],
                    data: [85, 75, 70, 60, 45],
                    colors: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
                }
            },
            {
                title: "Growth Projection Analysis",
                content: "12-month growth targets are achievable with 73% confidence based on market trends. Revenue projection shows 35% YoY growth potential. Key milestones include Q1 product launch, Q2 market expansion, Q3 scaling operations.",
                chartType: "line",
                chartData: {
                    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                    data: [15, 25, 35, 45],
                    colors: ['#1FB8CD']
                }
            }
        ];

        this.statisticsData = {
            sales: {
                revenue: [120000, 135000, 145000, 160000, 175000, 190000],
                months: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
                products: [
                    {name: "Premium Collection", sales: 65000, growth: "+12%"},
                    {name: "Classic Line", sales: 45000, growth: "+8%"}, 
                    {name: "Budget Series", sales: 25000, growth: "+15%"}
                ]
            },
            marketing: {
                platforms: [
                    {name: "Instagram", reach: 45000, engagement: "8.5%", conversion: "2.3%"},
                    {name: "YouTube", reach: 25000, engagement: "12.1%", conversion: "4.1%"},
                    {name: "Facebook", reach: 35000, engagement: "6.2%", conversion: "1.8%"}
                ],
                campaigns: [
                    {name: "Summer Collection", roi: 340, spent: 15000, revenue: 51000},
                    {name: "Festive Special", roi: 280, spent: 12000, revenue: 33600}
                ]
            },
            customerSegments: {
                ageGroups: [
                    {range: "18-25", percentage: 25, value: 35000},
                    {range: "26-35", percentage: 45, value: 67500}, 
                    {range: "36-50", percentage: 30, value: 45000}
                ],
                gender: [
                    {type: "Female", percentage: 65, value: 97500},
                    {type: "Male", percentage: 35, value: 52500}
                ]
            }
        };

        this.chatResponses = [
            "That's a great question! Based on your project analysis, I'd recommend focusing on digital marketing channels first as they show the highest ROI in your segment.",
            "According to market trends, this strategy typically shows results within 3-6 months. Would you like me to provide more specific timelines?",
            "The data suggests your target audience is most active during evening hours (6-9 PM). Consider scheduling your campaigns accordingly.",
            "Your growth projections look promising! The key success factors include consistent brand messaging and customer retention strategies.",
            "Based on similar businesses, I'd recommend allocating 15-20% of revenue to marketing for optimal growth trajectory."
        ];
    }

    init() {
        console.log('Initializing Vishwakarma App...');
        this.fetchProjects();
        this.bindEvents();
        console.log('App initialized successfully');
    }
    async fetchProjects() {
        try {
            const response = await fetch('/api/projects/', {
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed to load projects');
            const data = await response.json();
            this.projects = data.results || [];
            this.renderDashboard();
        } catch (error) {
            console.error('Error fetching projects:', error);
            this.projects = [];
            this.renderDashboard();
        }
    }


    bindEvents() {
        console.log('Binding events...');
        
        // Dashboard events - using event delegation for dynamic content
        document.body.addEventListener('click', (e) => {
            // Create project button
            if (e.target.id === 'create-project-btn' || e.target.closest('#create-project-btn')) {
                e.preventDefault();
                console.log('Create project clicked');
                this.openProjectCreation();
                return;
            }
            
            // Delete button
            if (e.target.classList.contains('btn--delete')) {
                e.preventDefault();
                const projectId = parseInt(e.target.dataset.projectId);
                console.log('Delete button clicked:', projectId);
                this.deleteProject(projectId);
                return;
            }
            
            // Project cards
            if (e.target.closest('.project-card')) {
                e.preventDefault();
                const card = e.target.closest('.project-card');
                const projectId = parseInt(card.dataset.projectId);
                console.log('Project card clicked:', projectId);
                this.openProject(projectId);
                return;
            }
            
            // Modal close buttons
            if (e.target.classList.contains('close-btn')) {
                e.preventDefault();
                console.log('Close button clicked');
                this.closeModal();
                this.closeApiModal();
                return;
            }
            
            // Back to dashboard
            if (e.target.id === 'back-to-dashboard') {
                e.preventDefault();
                console.log('Back to dashboard clicked');
                this.showDashboard();
                return;
            }
            
            // Navigation buttons
            if (e.target.classList.contains('nav-btn')) {
                e.preventDefault();
                const segment = e.target.dataset.segment;
                console.log('Nav button clicked:', segment);
                this.showSegment(segment);
                
                // Update active state
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                return;
            }
            
            // Project creation flow buttons
            if (e.target.id === 'next-to-details') {
                e.preventDefault();
                this.showBasicDetails();
                return;
            }
            
            if (e.target.id === 'back-to-type') {
                e.preventDefault();
                this.showTypeSelection();
                return;
            }
            
            if (e.target.id === 'start-questions') {
                e.preventDefault();
                this.startQuestions();
                return;
            }
            
            if (e.target.id === 'submit-answer') {
                e.preventDefault();
                this.submitAnswer();
                return;
            }
            
            if (e.target.id === 'next-question') {
                e.preventDefault();
                this.nextQuestion();
                return;
            }
            
            if (e.target.id === 'create-project') {
                e.preventDefault();
                this.createProject();
                return;
            }
            
            if (e.target.id === 'save-api-keys') {
                e.preventDefault();
                this.saveApiKeys();
                return;
            }
            if (e.target.id === 'add-api-key') {
                e.preventDefault();
                this.addCustomApiKey();
                return;
            }
            
            // Chat buttons
            if (e.target.id === 'send-btn') {
                e.preventDefault();
                this.sendMessage();
                return;
            }
            
            if (e.target.id === 'voice-btn') {
                e.preventDefault();
                this.handleVoiceInput();
                return;
            }
            
            if (e.target.id === 'clear-chat') {
                e.preventDefault();
                this.clearChat();
                return;
            }
        });
        
        // Change events for form elements
        document.body.addEventListener('change', (e) => {
            if (e.target.name === 'projectType') {
                this.handleTypeSelection();
            }
        });
        
        // Enter key for chat
        document.body.addEventListener('keypress', (e) => {
            if (e.target.id === 'chat-input-field' && e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeApiModal();
            }
        });
        
        // Close modal on backdrop click
        document.body.addEventListener('click', (e) => {
            if (e.target.id === 'project-creation-modal') {
                this.closeModal();
            }
            if (e.target.id === 'api-setup-modal') {
                this.closeApiModal();
            }
        });
        
                
        console.log('Events bound successfully');
    }

    renderDashboard() {
        console.log('Rendering dashboard...');
        const grid = document.getElementById('projects-grid');
        if (!grid) {
            console.error('Projects grid not found');
            return;
        }
        
        grid.innerHTML = this.projects.map(project => `
            <div class="project-card" data-project-id="${project.id}">
                <div class="project-card-header">
                    <h3 class="project-card-title">${project.name}</h3>
                    <span class="project-card-type ${project.type === 'Grow a Business' ? 'grow' : 'entry'}">
                        ${project.type}
                    </span>
                </div>
                <p class="project-card-description">${project.description}</p>
                <div class="project-card-footer">
                    <span>Created: ${this.formatDate(project.created_date)}</span>
                    <button class="btn btn--delete" data-project-id="${project.id}">Delete</button>
                </div>
            </div>
        `).join('');
        
        console.log(`Rendered ${this.projects.length} projects`);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    openProjectCreation() {
        console.log('Opening project creation modal...');
        const modal = document.getElementById('project-creation-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.showTypeSelection();
            this.resetCreationFlow();
            console.log('Project creation modal opened');
        } else {
            console.error('Project creation modal not found');
        }
    }

    closeModal() {
        const modal = document.getElementById('project-creation-modal');
        if (modal) {
            modal.classList.add('hidden');
            this.resetCreationFlow();
            console.log('Modal closed');
        }
    }

    closeApiModal() {
        const modal = document.getElementById('api-setup-modal');
        if (modal) {
            modal.classList.add('hidden');
            console.log('API modal closed');
        }
    }

    showTypeSelection() {
        const typeSelection = document.getElementById('type-selection');
        const basicDetails = document.getElementById('basic-details');
        const questionsFlow = document.getElementById('questions-flow');
        
        if (typeSelection) typeSelection.classList.remove('hidden');
        if (basicDetails) basicDetails.classList.add('hidden');
        if (questionsFlow) questionsFlow.classList.add('hidden');
    }

    handleTypeSelection() {
        const selectedType = document.querySelector('input[name="projectType"]:checked');
        const nextBtn = document.getElementById('next-to-details');
        
        if (nextBtn) {
            nextBtn.disabled = !selectedType;
        }
        
        if (selectedType) {
            this.newProject.type = selectedType.value;
            console.log('Project type selected:', selectedType.value);
        }
    }

    showBasicDetails() {
        const typeSelection = document.getElementById('type-selection');
        const basicDetails = document.getElementById('basic-details');
        
        if (typeSelection) typeSelection.classList.add('hidden');
        if (basicDetails) basicDetails.classList.remove('hidden');
    }

    startQuestions() {
        const nameField = document.getElementById('project-name');
        const descField = document.getElementById('project-desc');
        
        if (!nameField || !descField) return;
        
        const name = nameField.value.trim();
        const description = descField.value.trim();
        
        if (!name) {
            alert('Project name is required');
            return;
        }
        
        this.newProject.name = name;
        this.newProject.description = description;
        
        this.currentQuestionIndex = 0;
        this.questionAnswers = [];
        
        const basicDetails = document.getElementById('basic-details');
        const questionsFlow = document.getElementById('questions-flow');
        
        if (basicDetails) basicDetails.classList.add('hidden');
        if (questionsFlow) questionsFlow.classList.remove('hidden');
        
        this.showQuestion();
        console.log('Started questions flow');
    }

    showQuestion() {
        const questionText = document.getElementById('question-text');
        const questionNumber = document.getElementById('question-number');
        const answerField = document.getElementById('question-answer');
        const analysisSection = document.getElementById('analysis-section');
        
        if (questionNumber) questionNumber.textContent = this.currentQuestionIndex + 1;
        if (questionText) questionText.textContent = this.questions[this.currentQuestionIndex];
        if (answerField) answerField.value = '';
        if (analysisSection) analysisSection.classList.add('hidden');
        
        // Reset button visibility
        const submitBtn = document.getElementById('submit-answer');
        const nextBtn = document.getElementById('next-question');
        const createBtn = document.getElementById('create-project');
        
        if (submitBtn) submitBtn.classList.remove('hidden');
        if (nextBtn) nextBtn.classList.add('hidden');
        if (createBtn) createBtn.classList.add('hidden');
        
        console.log(`Showing question ${this.currentQuestionIndex + 1}`);
    }

    submitAnswer() {
        const answerField = document.getElementById('question-answer');
        if (!answerField) return;
        
        const answer = answerField.value.trim();
        if (!answer) {
            alert('Please provide an answer');
            return;
        }
        
        this.questionAnswers.push(answer);
        this.showAnalysis();
        
        // Hide submit button and show appropriate next action
        const submitBtn = document.getElementById('submit-answer');
        const nextBtn = document.getElementById('next-question');
        const createBtn = document.getElementById('create-project');
        
        if (submitBtn) submitBtn.classList.add('hidden');
        
        if (this.currentQuestionIndex < this.questions.length - 1) {
            if (nextBtn) nextBtn.classList.remove('hidden');
        } else {
            if (createBtn) createBtn.classList.remove('hidden');
        }
        
        console.log('Answer submitted for question', this.currentQuestionIndex + 1);
    }

    showAnalysis() {
        const analysisSection = document.getElementById('analysis-section');
        const analysisContent = document.getElementById('analysis-content');
        
        if (!analysisSection || !analysisContent) return;
        
        const analysis = this.analysisData[this.currentQuestionIndex];
        
        analysisContent.innerHTML = `
            <h4>${analysis.title}</h4>
            <p>${analysis.content}</p>
            <div class="chart-container">
                <canvas id="analysis-chart-${this.currentQuestionIndex}"></canvas>
            </div>
        `;
        
        analysisSection.classList.remove('hidden');
        
        // Create chart after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.createChart(`analysis-chart-${this.currentQuestionIndex}`, analysis);
        }, 100);
        
        console.log('Analysis shown for question', this.currentQuestionIndex + 1);
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.showQuestion();
    }

    createProject() {
        console.log('Creating project...');
        this.showLoading();
        
        this.createProjectOnServer();
    }

    async createProjectOnServer() {
        try {
            const payload = {
                name: this.newProject.name,
                type: this.newProject.type,
                description: this.newProject.description,
                answers: [...this.questionAnswers],
                charts: this.buildChartsSnapshot()
            };
            const response = await fetch('/api/projects/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || 'Failed to create project');
            }
            const project = await response.json();
            await this.fetchProjects();
            this.hideLoading();
            this.closeModal();
            this.openProject(project.id);
            console.log('Project created successfully');
        } catch (error) {
            console.error('Error creating project:', error);
            alert(error.message || 'Failed to create project');
            this.hideLoading();
        }
    }

    buildChartsSnapshot() {
        // Capture the static analysis and statistics data used to render charts
        const analysis = this.analysisData.map(item => ({
            title: item.title,
            chartType: item.chartType,
            labels: [...(item.chartData?.labels || [])],
            data: [...(item.chartData?.data || [])],
            colors: item.chartData?.colors || null
        }));

        const statistics = {
            sales: {
                months: [...(this.statisticsData.sales?.months || [])],
                revenue: [...(this.statisticsData.sales?.revenue || [])]
            },
            marketing: {
                platforms: (this.statisticsData.marketing?.platforms || []).map(p => ({
                    name: p.name,
                    reach: p.reach,
                    engagement: p.engagement,
                    conversion: p.conversion
                }))
            },
            customerSegments: {
                ageGroups: (this.statisticsData.customerSegments?.ageGroups || []).map(g => ({
                    range: g.range,
                    percentage: g.percentage,
                    value: g.value
                })),
                gender: (this.statisticsData.customerSegments?.gender || []).map(g => ({
                    type: g.type,
                    percentage: g.percentage,
                    value: g.value
                }))
            }
        };

        return { analysis, statistics };
    }

    resetCreationFlow() {
        this.currentQuestionIndex = 0;
        this.questionAnswers = [];
        this.newProject = {};
        
        // Reset form fields
        document.querySelectorAll('input[name="projectType"]').forEach(radio => radio.checked = false);
        
        const nameField = document.getElementById('project-name');
        const descField = document.getElementById('project-desc');
        const answerField = document.getElementById('question-answer');
        const nextBtn = document.getElementById('next-to-details');
        
        if (nameField) nameField.value = '';
        if (descField) descField.value = '';
        if (answerField) answerField.value = '';
        if (nextBtn) nextBtn.disabled = true;
        
        // Reset button visibility
        const submitBtn = document.getElementById('submit-answer');
        const nextQuestionBtn = document.getElementById('next-question');
        const createBtn = document.getElementById('create-project');
        
        if (submitBtn) submitBtn.classList.remove('hidden');
        if (nextQuestionBtn) nextQuestionBtn.classList.add('hidden');
        if (createBtn) createBtn.classList.add('hidden');
        
        // Hide analysis section
        const analysisSection = document.getElementById('analysis-section');
        if (analysisSection) {
            analysisSection.classList.add('hidden');
        }
    }

    openProject(projectId) {
        console.log('Opening project:', projectId);
        this.currentProject = this.projects.find(p => p.id === projectId);
        if (this.currentProject) {
            this.showProjectView();
        } else {
            console.error('Project not found:', projectId);
        }
    }

    showProjectView() {
        console.log('Showing project view for:', this.currentProject.name);
        const dashboardView = document.getElementById('dashboard-view');
        const projectView = document.getElementById('project-view');
        
        if (dashboardView) dashboardView.classList.add('hidden');
        if (projectView) projectView.classList.remove('hidden');
        
        // Update project header
        const titleEl = document.getElementById('project-title');
        const typeEl = document.getElementById('project-type');
        const dateEl = document.getElementById('project-date');
        const descEl = document.getElementById('project-description');
        
        if (titleEl) titleEl.textContent = this.currentProject.name;
        if (typeEl) {
            typeEl.textContent = this.currentProject.type;
            typeEl.className = `status ${this.currentProject.type === 'Grow a Business' ? 'status--success' : 'status--info'}`;
        }
        if (dateEl) dateEl.textContent = `Created: ${this.formatDate(this.currentProject.created_date)}`;
        if (descEl) descEl.textContent = this.currentProject.description;
        
        // Reset navigation and show first segment
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        const firstNavBtn = document.querySelector('.nav-btn[data-segment="description"]');
        if (firstNavBtn) firstNavBtn.classList.add('active');
        
        this.showSegment('description');
    }

    showSegment(segment) {
        console.log('Showing segment:', segment);
        this.currentSegment = segment;
        const content = document.getElementById('segment-content');
        if (!content) return;
        
        switch(segment) {
            case 'description':
                this.renderDescriptionSegment(content);
                break;
            case 'analysis':
                this.renderAnalysisSegment(content);
                break;
            case 'statistics':
                this.renderStatisticsSegment(content);
                break;
            case 'chat':
                this.renderChatSegment(content);
                break;
        }
    }

    renderDescriptionSegment(container) {
        const qaItems = this.questions.map((question, index) => `
            <div class="qa-item">
                <div class="qa-question">
                    <span class="qa-question-number">${index + 1}</span>
                    ${question}
                </div>
                <div class="qa-answer">${this.currentProject.answers[index]}</div>
            </div>
        `).join('');
        
        container.innerHTML = `
            <div class="qa-list">
                ${qaItems}
            </div>
        `;
    }

    renderAnalysisSegment(container) {
        const analysisItems = this.analysisData.map((analysis, index) => `
            <div class="analysis-item">
                <h3 class="analysis-title">${analysis.title}</h3>
                <div class="analysis-content">${analysis.content}</div>
                <div class="chart-container">
                    <canvas id="segment-chart-${index}"></canvas>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = `
            <div class="analysis-list">
                ${analysisItems}
            </div>
        `;
        
        // Create charts
        setTimeout(() => {
            this.analysisData.forEach((analysis, index) => {
                this.createChart(`segment-chart-${index}`, analysis);
            });
        }, 100);
    }

    renderStatisticsSegment(container) {
        if (!this.apiKeysSetup) {
            const apiModal = document.getElementById('api-setup-modal');
            if (apiModal) apiModal.classList.remove('hidden');
            container.innerHTML = '<div class="text-center"><p>Setting up API connections...</p></div>';
            return;
        }
        
        container.innerHTML = `
            <div class="stats-dashboard">
                <div class="stats-card">
                    <h3 class="stats-card-title">Sales Overview</h3>
                    <div class="stats-metrics">
                        <div class="metric">
                            <span class="metric-value">₹190K</span>
                            <div class="metric-label">Total Revenue</div>
                        </div>
                        <div class="metric">
                            <span class="metric-value">+12%</span>
                            <div class="metric-label">Growth</div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="sales-chart"></canvas>
                    </div>
                </div>
                
                <div class="stats-card">
                    <h3 class="stats-card-title">Marketing Performance</h3>
                    <div class="stats-metrics">
                        <div class="metric">
                            <span class="metric-value">105K</span>
                            <div class="metric-label">Total Reach</div>
                        </div>
                        <div class="metric">
                            <span class="metric-value">8.9%</span>
                            <div class="metric-label">Avg Engagement</div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="marketing-chart"></canvas>
                    </div>
                </div>
                
                <div class="stats-card">
                    <h3 class="stats-card-title">Customer Segmentation</h3>
                    <div class="chart-container">
                        <canvas id="customer-age-chart"></canvas>
                    </div>
                </div>
                
                <div class="stats-card">
                    <h3 class="stats-card-title">Platform Comparison</h3>
                    <div class="chart-container">
                        <canvas id="platform-chart"></canvas>
                    </div>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            this.createStatisticsCharts();
        }, 100);
    }

    renderChatSegment(container) {
        container.innerHTML = `
            <div class="chat-container">
                <div class="chat-header">
                    <h3>Project Assistant</h3>
                    <button id="clear-chat" class="btn btn--outline btn--sm">Clear Chat</button>
                </div>
                <div id="chat-messages" class="chat-messages">
                    <div class="message system">
                        Hello! I'm your project assistant. Ask me anything about your business strategy, market analysis, or growth plans.
                    </div>
                </div>
                <div class="chat-input">
                    <input type="text" id="chat-input-field" class="chat-input-field" placeholder="Ask a question...">
                    <div class="chat-actions">
                        <button id="voice-btn" class="btn btn--outline btn--sm">🎤 Voice</button>
                        <button id="send-btn" class="btn btn--primary btn--sm">Send</button>
                    </div>
                </div>
            </div>
        `;
    }

    sendMessage() {
        const inputField = document.getElementById('chat-input-field');
        if (!inputField) return;
        
        const message = inputField.value.trim();
        
        if (!message) return;
        
        this.addMessage('user', message);
        inputField.value = '';
        
        // Simulate typing delay
        setTimeout(() => {
            const response = this.getRandomResponse();
            this.addMessage('system', response);
        }, 1000);
    }

    addMessage(type, text) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    getRandomResponse() {
        return this.chatResponses[Math.floor(Math.random() * this.chatResponses.length)];
    }

    handleVoiceInput() {
        // Simulate voice-to-text
        const sampleQuestions = [
            "What are the best marketing strategies for my business?",
            "How can I improve customer retention?",
            "What should be my budget allocation for digital marketing?",
            "How do I analyze my competition effectively?"
        ];
        
        const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
        const inputField = document.getElementById('chat-input-field');
        if (inputField) {
            inputField.value = randomQuestion;
        }
    }

    clearChat() {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;
        
        messagesContainer.innerHTML = `
            <div class="message system">
                Hello! I'm your project assistant. Ask me anything about your business strategy, market analysis, or growth plans.
            </div>
        `;
    }

    saveApiKeys() {
        const instagramField = document.getElementById('instagram-api');
        const youtubeField = document.getElementById('youtube-api');
        const flipkartField = document.getElementById('flipkart-api');
        const customKeysList = this.customApiKeys;
        
        if (!instagramField || !youtubeField || !flipkartField) return;
        
        const instagram = instagramField.value.trim();
        const youtube = youtubeField.value.trim();
        const flipkart = flipkartField.value.trim();
        
        const providedCount = [instagram, youtube, flipkart].filter(Boolean).length + (customKeysList?.length || 0);
        if (providedCount < 1) {
            alert('Please enter at least one API key');
            return;
        }
        
        this.apiKeysSetup = true;
        this.closeApiModal();
        
        const segmentContent = document.getElementById('segment-content');
        if (segmentContent) {
            this.renderStatisticsSegment(segmentContent);
        }
        
        console.log('API keys saved successfully');
    }

    addCustomApiKey() {
        const input = document.getElementById('custom-api-input');
        const list = document.getElementById('custom-keys-list');
        if (!input || !list) return;
        const value = input.value.trim();
        if (!value) return;
        this.customApiKeys.push(value);
        input.value = '';
        this.renderCustomKeysList(list);
    }

    renderCustomKeysList(container) {
        if (!container) return;
        if (this.customApiKeys.length === 0) {
            container.innerHTML = '';
            return;
        }
        container.innerHTML = this.customApiKeys
            .map((key, idx) => `<div class="key-chip" data-key-idx="${idx}">${this.maskKey(key)}</div>`)
            .join('');
    }

    maskKey(key) {
        if (key.length <= 6) return '*'.repeat(Math.max(0, key.length - 2)) + key.slice(-2);
        return key.slice(0, 3) + '***' + key.slice(-3);
    }

    createChart(canvasId, analysis) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const config = this.getChartConfig(analysis);
        
        try {
            new Chart(ctx, config);
        } catch (error) {
            console.error('Error creating chart:', error);
        }
    }

    getChartConfig(analysis) {
        const baseColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];
        
        const config = {
            type: analysis.chartType,
            data: {
                labels: analysis.chartData.labels,
                datasets: [{
                    data: analysis.chartData.data,
                    backgroundColor: analysis.chartData.colors || baseColors,
                    borderColor: analysis.chartData.colors || baseColors,
                    borderWidth: 2,
                    fill: analysis.chartType === 'line' ? false : true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: analysis.chartType === 'pie' || analysis.chartType === 'doughnut'
                    }
                },
                scales: analysis.chartType !== 'pie' && analysis.chartType !== 'doughnut' && analysis.chartType !== 'radar' ? {
                    y: {
                        beginAtZero: true
                    }
                } : {}
            }
        };
        
        return config;
    }

    createStatisticsCharts() {
        // Sales Chart
        const salesCtx = document.getElementById('sales-chart');
        if (salesCtx) {
            new Chart(salesCtx, {
                type: 'line',
                data: {
                    labels: this.statisticsData.sales.months,
                    datasets: [{
                        label: 'Revenue',
                        data: this.statisticsData.sales.revenue,
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }
        
        // Marketing Chart
        const marketingCtx = document.getElementById('marketing-chart');
        if (marketingCtx) {
            new Chart(marketingCtx, {
                type: 'bar',
                data: {
                    labels: this.statisticsData.marketing.platforms.map(p => p.name),
                    datasets: [{
                        label: 'Reach',
                        data: this.statisticsData.marketing.platforms.map(p => p.reach),
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }
        
        // Customer Age Chart
        const customerCtx = document.getElementById('customer-age-chart');
        if (customerCtx) {
            new Chart(customerCtx, {
                type: 'doughnut',
                data: {
                    labels: this.statisticsData.customerSegments.ageGroups.map(g => g.range),
                    datasets: [{
                        data: this.statisticsData.customerSegments.ageGroups.map(g => g.percentage),
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
        
        // Platform Comparison Chart
        const platformCtx = document.getElementById('platform-chart');
        if (platformCtx) {
            new Chart(platformCtx, {
                type: 'radar',
                data: {
                    labels: ['Reach', 'Engagement', 'Conversion'],
                    datasets: [{
                        label: 'Instagram',
                        data: [45, 8.5, 2.3],
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)'
                    }, {
                        label: 'YouTube',
                        data: [25, 12.1, 4.1],
                        borderColor: '#FFC185',
                        backgroundColor: 'rgba(255, 193, 133, 0.1)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    showDashboard() {
        console.log('Showing dashboard');
        const dashboardView = document.getElementById('dashboard-view');
        const projectView = document.getElementById('project-view');
        
        if (projectView) projectView.classList.add('hidden');
        if (dashboardView) dashboardView.classList.remove('hidden');
        
        this.currentProject = null;
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('hidden');
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }

    async deleteProject(projectId) {
        console.log('Deleting project:', projectId);
        
        // Show confirmation dialog
        const project = this.projects.find(p => p.id === projectId);
        if (!project) {
            console.error('Project not found:', projectId);
            return;
        }
        
        const confirmed = confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`);
        if (!confirmed) {
            console.log('Delete cancelled by user');
            return;
        }
        
        this.showLoading();
        
        try {
            const response = await fetch(`/api/projects/${projectId}/`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete project');
            }
            
            // Remove project from local array
            this.projects = this.projects.filter(p => p.id !== projectId);
            
            // If we're currently viewing the deleted project, go back to dashboard
            if (this.currentProject && this.currentProject.id === projectId) {
                this.showDashboard();
            }
            
            // Re-render dashboard
            this.renderDashboard();
            
            console.log('Project deleted successfully');
            
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project. Please try again.');
        } finally {
            this.hideLoading();
        }
    }
}

// Initialize the application when DOM is ready
function initApp() {
    console.log('DOM ready, initializing app...');
    app = new VishwakarmaApp();
    app.init();
    window.app = app; // Make globally available
}

// Multiple initialization methods to ensure it works
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Fallback initialization after a short delay
setTimeout(() => {
    if (!window.app) {
        console.log('Fallback initialization...');
        initApp();
    }
}, 100);