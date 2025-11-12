pipeline {
  agent any

  environment {
    IMAGE = "hemanthr2002/frontend-app"   // change per repo
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: env.BRANCH_NAME ?: 'develop',
            url: 'https://github.com/hemanth-organizations/frontend-app.git',
            credentialsId: 'github-org-creds'
      }
    }

    stage('Build') {
      steps {
        sh 'docker build -t ${IMAGE}:${GIT_COMMIT::8} .'
        sh 'docker tag ${IMAGE}:${GIT_COMMIT::8} ${IMAGE}:latest'
      }
    }

    stage('Run (for smoke test)') {
      steps {
        sh 'docker rm -f cicd-run || true'
        sh 'docker run -d --name cicd-run -p 3001:3000 ${IMAGE}:latest'
        // optionally add smoke test curl commands here
      }
    }

    stage('Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
          sh 'docker push ${IMAGE}:latest'
        }
      }
    }
  }

  post {
    success { echo "Build & push OK" }
    failure {
      echo "Failed — cleaning up"
      sh 'docker rm -f cicd-run || true'
    }
    always {
      sh 'docker rm -f cicd-run || true'  // cleanup
    }
  }
}
