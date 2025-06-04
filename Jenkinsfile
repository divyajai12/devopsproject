pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'docker.io'
        IMAGE_NAME = 'myapp'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/divyajai12/devopsproject.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Building application...'
                // Example: compile/build commands, adapt to your tech stack
                bat 'mvn clean package' // or 'gradle build', 'npm run build', etc.
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                bat 'mvn test' // or your test command
            }
            post {
                always {
                    junit 'target/surefire-reports/*.xml' // collect test reports
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh """
                            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin $DOCKER_REGISTRY
                            docker build -t $DOCKER_USER/$IMAGE_NAME:${env.BUILD_NUMBER} .
                        """
                    }
                }
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh """
                            docker push $DOCKER_USER/$IMAGE_NAME:${env.BUILD_NUMBER}
                        """
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                // Example deploy commands:
                // kubectl set image deployment/myapp-deployment myapp=$DOCKER_USER/$IMAGE_NAME:${env.BUILD_NUMBER}
                // or invoke ansible/playbook, or any deployment script
            }
        }

        stage('Post-Deployment Tests') {
            steps {
                echo 'Validating deployment...'
                // e.g. run integration or smoke tests against deployed app
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
        always {
            echo 'Cleaning up...'
            // e.g., docker logout, cleanup workspace
        }
    }
}
