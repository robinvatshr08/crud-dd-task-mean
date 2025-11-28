pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "robinvats/curd-backend"
        FRONTEND_IMAGE = "robinvats/curd-frontend"
        DOCKER_TAG = "latest"
        EC2_IP = "13.60.28.116"
    }

    stages {

        stage('Pull Code') {
            steps {
                 echo "cloning from github "
                git branch: 'main', url: 'https://github.com/robinvats/crud-dd-task-mean.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                 echo "Backend docker Image building "
                sh "docker buildx build --platform linux/amd64 -t ${BACKEND_IMAGE}:${DOCKER_TAG} ./backend"
            }
        }

        stage('Build Frontend Image') {
            steps {
                 echo "frontend docker image building "
                sh "docker buildx build --platform linux/amd64 -t ${FRONTEND_IMAGE}:${DOCKER_TAG} ./frontend"
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                 echo "Push image to Docker Hub "
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                    sh "docker push ${BACKEND_IMAGE}:${DOCKER_TAG}"
                    sh "docker push ${FRONTEND_IMAGE}:${DOCKER_TAG}"
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@${13.60.28.116} '
                        cd ~/application/crud-dd-task-mean &&
                        docker-compose pull &&
                        docker-compose up -d
                        '
                    """
                }
            }
        }
    }

    post {
        always {
            echo "🚀 CI/CD Pipeline Completed!"
        }
    }
}
