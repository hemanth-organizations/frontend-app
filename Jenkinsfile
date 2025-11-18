pipeline {
  agent any

  environment {
    DOCKER_BUILDKIT = "0"
    IMAGE = "hemanthr2002/frontend-app"
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
        sh '''
        SHORT=$(echo $GIT_COMMIT | cut -c1-8)
        echo "Using short commit ID: $SHORT"
        docker build -t ${IMAGE}:$SHORT .
        docker tag ${IMAGE}:$SHORT ${IMAGE}:latest
        '''
      }
    }

    stage('Run (for smoke test)') {
      steps {
        sh '''
        docker rm -f cicd-run || true
        docker run -d --name cicd-run -p 3100:3000 ${IMAGE}:latest
        '''
      }
    }

    stage('Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
          echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
          docker push ${IMAGE}:latest
          '''
        }
      }
    }
  }

  post {
    always {
      sh 'docker rm -f cicd-run || true'
    }
  }
}
