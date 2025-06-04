pipeline {
    agent any

    environment {
        DOCKER_USER = 'DockerHub'  // your DockerHub username
    }

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
        stage('Docker Build') {
            steps {
                bat 'docker build -t %DOCKER_USER%/myapp:%BUILD_NUMBER% .'
            }
        }
        stage('Docker Push') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-pass', variable: 'DOCKER_PASS')]) {
                    bat '''
                        echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                        docker push %DOCKER_USER%/myapp:%BUILD_NUMBER%
                    '''
                }
            }
        }
        stage('Deploy') {
            steps {
                bat 'echo Deploying application...'
            }
        }
    }
}
