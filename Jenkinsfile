pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = 'dockerhub-creds' // Jenkins credential ID
    DOCKER_USER = 'divyajai123'               // Your Docker Hub username
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/divyajai12/devopsproject.git'
      }
    }

    stage('Read and Increment Version') {
      steps {
        script {
          def version = readFile('version.txt').trim()
          echo "Current version: ${version}"

          def parts = version.tokenize('.')
          def newVersion = "${parts[0]}.${parts[1]}.${parts[2].toInteger() + 1}"
          echo "New version: ${newVersion}"

          writeFile file: 'version.txt', text: newVersion
          writeFile file: 'app_version.txt', text: newVersion
          currentBuild.description = "App version: ${newVersion}"
        }
      }
    }

    stage('Build') {
      steps {
        bat 'echo Building application...'
        // Insert actual build commands here (e.g. npm run build)
      }
    }

    stage('Test') {
      steps {
        bat 'echo Running tests...'
        // Insert test commands here
      }
    }

    stage('Docker Build & Push') {
      steps {
        script {
          def appVersion = readFile('app_version.txt').trim()

          // Set Docker context explicitly to avoid endpoint issues
          withEnv(['DOCKER_HOST=npipe:////./pipe/docker_engine']) {
            docker.withRegistry('https://index.docker.io/v1/', env.DOCKERHUB_CREDENTIALS) {
              def image = docker.build("${env.DOCKER_USER}/myapp:${appVersion}")
              image.push()
            }
          }
        }
      }
    }

    stage('Deploy with Docker Compose') {
      steps {
        bat 'docker-compose up -d --build'
      }
    }

    stage('Health Check') {
      steps {
        script {
          timeout(time: 2, unit: 'MINUTES') {
            retry(3) {
              def status = bat(script: 'curl -f http://localhost:3000/health', returnStatus: true)
              if (status != 0) {
                echo 'Health check failed. Retrying...'
                error('Health check failed')
              } else {
                echo 'Health check passed.'
              }
            }
          }
        }
      }
    }
  }

  post {
    success {
      echo "Build and deployment succeeded."
    }
    failure {
      echo "Build or deployment failed."
    }
    always {
      echo 'Pipeline finished.'
    }
  }
}
