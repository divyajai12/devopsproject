pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/divyajai12/devopsproject.git', branch: 'main'
            }
        }

        stage('Read and Increment Version') {
            steps {
                script {
                    def version = readFile('version.txt').trim()
                    echo "Current version: ${version}"

                    def (major, minor, patch) = version.tokenize('.')
                    patch = (patch.toInteger() + 1).toString()
                    def newVersion = "${major}.${minor}.${patch}"
                    echo "New version: ${newVersion}"

                    writeFile file: 'version.txt', text: newVersion
                    writeFile file: 'new_version.txt', text: newVersion
                }
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
                script {
                    def newVersion = readFile('new_version.txt').trim()
                    withDockerRegistry([credentialsId: 'dockerhub-creds', url: 'https://index.docker.io/v1/']) {
                        bat "docker build -t \"divyajai123/myapp:${newVersion}\" ."
                        bat "docker tag \"divyajai123/myapp:${newVersion}\" \"index.docker.io/divyajai123/myapp:${newVersion}\""
                        bat "docker push \"index.docker.io/divyajai123/myapp:${newVersion}\""
                    }
                }
            }
        }
    }
}
