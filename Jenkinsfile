pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/username/repo.git'
            }
        }
        stage('Build') {
            steps {
                sh 'echo Building application...'
                // Add your build commands here
            }
        }
        stage('Test') {
            steps {
                sh 'echo Running tests...'
                // Add your test commands here
            }
        }
        stage('Docker Build') {
            steps {
                sh 'docker build -t myapp:${env.BUILD_NUMBER} .'
            }
        }
        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                    sh 'docker push myapp:${env.BUILD_NUMBER}'
                }
            }
        }
        stage('Deploy') {
            steps {
                sh 'echo Deploying application...'
                // Add your deployment commands here
            }
        }
    }
}
