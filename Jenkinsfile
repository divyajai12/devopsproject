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
                bat 'docker build -t myapp:%BUILD_NUMBER% .'
            }
        }
        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    bat '''
                        echo %PASS% | docker login -u %USER% --password-stdin
                        docker push myapp:%BUILD_NUMBER%
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
