pipeline {
  agent any

  environment {
    // Set DockerHub credentials environment variables
    DOCKERHUB_CREDENTIALS = 'dockerhub-creds' // Jenkins credentials ID
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
          def major = parts[0].toInteger()
          def minor = parts[1].toInteger()
          def patch = parts[2].toInteger() + 1

          def newVersion = "${major}.${minor}.${patch}"
          echo "New version: ${newVersion}"

          writeFile file: 'version.txt', text: newVersion
          env.APP_VERSION = newVersion
        }
      }
    }

    stage('Build') {
      steps {
        script {
          if (isUnix()) {
            sh 'echo Building application...'
            // Add your actual build commands here (e.g. mvn, npm build, etc.)
          } else {
            bat 'echo Building application...'
            // Add your actual build commands here for Windows
          }
        }
      }
    }

    stage('Test') {
      steps {
        script {
          if (isUnix()) {
            sh 'echo Running tests...'
            // Add your actual test commands here
          } else {
            bat 'echo Running tests...'
            // Add your actual test commands here for Windows
          }
        }
      }
    }

    stage('Docker Build & Push') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            if (isUnix()) {
              sh """
                echo Logging into DockerHub...
                echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin

                echo Building Docker image...
                docker build -t $DOCKER_USER/myapp:${env.APP_VERSION} .

                echo Pushing Docker image to DockerHub...
                docker push $DOCKER_USER/myapp:${env.APP_VERSION}

                docker logout
              """
            } else {
              bat """
                echo Logging into DockerHub...
                echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin

                echo Building Docker image...
                docker build -t %DOCKER_USER%/myapp:${env.APP_VERSION} .

                echo Pushing Docker image to DockerHub...
                docker push %DOCKER_USER%/myapp:${env.APP_VERSION}

                docker logout
              """
            }
          }
        }
      }
    }

    stage('Deploy') {
      steps {
        script {
          if (isUnix()) {
            sh 'docker-compose up -d --build'
          } else {
            bat 'docker-compose up -d --build'
          }
        }
      }
    }

    stage('Health Check') {
      steps {
        script {
          def status
          if (isUnix()) {
            status = sh(script: 'curl -f http://localhost:3000/health', returnStatus: true)
          } else {
            status = bat(script: 'curl -f http://localhost:3000/health', returnStatus: true)
          }

          if (status != 0) {
            echo 'Health check failed! Rolling back...'
            if (isUnix()) {
              sh 'docker-compose down'
              sh 'docker-compose up -d --no-build'
            } else {
              bat 'docker-compose down'
              bat 'docker-compose up -d --no-build'
            }
            error('Deployment failed and rollback executed.')
          }
        }
      }
    }
  }

  post {
    success {
      emailext(
        subject: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
        body: "Good news! The build succeeded.\n\nDetails: ${env.BUILD_URL}",
        recipientProviders: [[$class: 'DevelopersRecipientProvider']]
      )
    }
    failure {
      emailext(
        subject: "FAILURE: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
        body: "Oops! The build failed.\n\nDetails: ${env.BUILD_URL}",
        recipientProviders: [[$class: 'DevelopersRecipientProvider']]
      )
    }
    always {
      echo 'Pipeline finished.'
    }
  }
}
