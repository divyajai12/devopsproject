pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = 'dockerhub-creds' // Jenkins credential ID
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
        sh 'echo Building application...'
        // Insert actual build commands here (e.g. npm run build)
      }
    }

    stage('Test') {
      steps {
        sh 'echo Running tests...'
        // Insert test commands here
      }
    }

    stage('Docker Build & Push') {
      steps {
        script {
          def appVersion = readFile('app_version.txt').trim()
          withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            sh """
              echo Logging into DockerHub...
              echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin

              echo Building Docker image...
              docker build -t \$DOCKER_USER/myapp:${appVersion} .

              echo Pushing Docker image...
              docker push \$DOCKER_USER/myapp:${appVersion}

              docker logout
            """
          }
        }
      }
    }

    stage('Deploy with Docker Compose') {
      steps {
        sh 'docker-compose up -d --build'
      }
    }

    stage('Health Check') {
      steps {
        script {
          def status = sh(script: 'curl -f http://localhost:3000/health', returnStatus: true)
          if (status != 0) {
            echo 'Health check failed! Rolling back deployment...'
            sh 'docker-compose down'
            sh 'docker-compose up -d --no-build'
            error('Deployment failed and rollback completed.')
          } else {
            echo 'Health check passed.'
          }
        }
      }
    }
  }

  post {
    success {
      echo "Build and deployment succeeded."
      // Uncomment when Email Extension plugin is configured:
      /*
      emailext(
        subject: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
        body: "Good news! The build succeeded.\n\nDetails: ${env.BUILD_URL}",
        recipientProviders: [[$class: 'DevelopersRecipientProvider']]
      )
      */
    }
    failure {
      echo "Build or deployment failed."
      // Uncomment when Email Extension plugin is configured:
      /*
      emailext(
        subject: "FAILURE: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
        body: "Oops! The build failed.\n\nDetails: ${env.BUILD_URL}",
        recipientProviders: [[$class: 'DevelopersRecipientProvider']]
      )
      */
    }
    always {
      echo 'Pipeline finished.'
    }
  }
}
