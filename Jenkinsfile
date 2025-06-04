pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/divyajai12/devopsproject.git'
            }
        }

        stage('Build') {
            steps {
                bat 'echo Building application...'
            }
        }

        stage('Test') {
            steps {
                bat 'echo Running tests...'
            }
        }

        stage('Docker Build & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat """
                        echo Logging into DockerHub...
                        echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin

                        echo Building Docker image...
                        docker build -t %DOCKER_USER%/myapp:%BUILD_NUMBER% .

                        echo Pushing Docker image to DockerHub...
                        docker push %DOCKER_USER%/myapp:%BUILD_NUMBER%

                        echo Logout DockerHub
                        docker logout
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                bat 'echo Deploying application... (simulated)'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs for errors.'
        }
    }
}
