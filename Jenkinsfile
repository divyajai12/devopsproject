pipeline {
    agent any

    environment {
        // You can optionally remove DOCKER_USER from here, 
        // since we'll load it dynamically via withCredentials
        // DOCKER_USER = 'DockerHub'
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
                bat 'docker build -t DockerHub/myapp:%BUILD_NUMBER% .'
            }
        }
        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
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
