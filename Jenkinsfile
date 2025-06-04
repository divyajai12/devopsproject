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
                // Add your build commands here (Windows style)
            }
        }
        stage('Test') {
            steps {
                bat 'echo Running tests...'
                // Add your test commands here
            }
        }
        stage('Docker Build') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                   bat ' echo DOCKER_USER is [%DOCKER_USER%]'
                    bat 'docker build -t "%DOCKER_USER%/myapp:%BUILD_NUMBER%" .'
                }
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
                // Add your deployment commands here
            }
        }
    }
}
