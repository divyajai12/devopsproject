pipeline {
    agent any

    environment {
        GIT_REPO = 'https://github.com/divyajai12/devopsproject.git'
        DOCKER_IMAGE = "divyajai123/myapp"
        DOCKER_REGISTRY_CREDENTIALS = 'dockerhub-creds'
        EMAIL_RECIPIENTS = 'divyajai207@gmail.com'  // <-- change this to your email
    }

    stages {
        stage('Checkout SCM') {
            steps {
                git url: "${env.GIT_REPO}", branch: 'main', credentialsId: "${env.DOCKER_REGISTRY_CREDENTIALS}"
            }
        }

        stage('Read and Increment Version') {
            steps {
                script {
                    def versionFile = 'version.txt'
                    def currentVersion = readFile(versionFile).trim()
                    echo "Current version: ${currentVersion}"

                    def parts = currentVersion.tokenize('.')
                    def patch = parts[2].toInteger() + 1
                    def newVersion = "${parts[0]}.${parts[1]}.${patch}"
                    echo "New version: ${newVersion}"

                    writeFile file: versionFile, text: newVersion
                    env.NEW_VERSION = newVersion
                }
            }
        }

        stage('Build') {
            steps {
                echo 'Building application...'
                // Add your build commands here, e.g. 'npm install' or 'mvn package'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                // Add your test commands here
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', env.DOCKER_REGISTRY_CREDENTIALS) {
                        def image = docker.build("${env.DOCKER_IMAGE}:${env.NEW_VERSION}")
                        image.push()
                        image.push('latest')  // Optionally tag latest
                    }
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    try {
                        bat 'docker-compose down'
                        bat 'docker-compose up -d --build'
                    } catch (err) {
                        error "Deployment failed, rolling back..."
                    }
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    // Example health check command; adjust as needed
                    def result = bat(returnStatus: true, script: 'curl -f http://localhost:8080/health || exit 1')
                    if (result != 0) {
                        error "Health check failed!"
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded!'
            mail to: "${env.EMAIL_RECIPIENTS}",
                 subject: "Jenkins Pipeline Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Good news! The pipeline succeeded.\n\nCheck the build details here: ${env.BUILD_URL}"
        }
        failure {
            echo 'Pipeline failed!'
            mail to: "${env.EMAIL_RECIPIENTS}",
                 subject: "Jenkins Pipeline Failure: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Attention! The pipeline failed.\n\nCheck the build details here: ${env.BUILD_URL}"
        }
    }
}
