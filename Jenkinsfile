// Jenkinsfile

pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "gcr.io/${env.GOOGLE_CLOUD_PROJECT_ID ?: '<your-gcp-project-id>'}"
        DOCKER_IMAGE_NAME = "c1one-front"
        DOCKER_IMAGE_TAG = "${env.BUILD_NUMBER}"

        DEPLOY_SERVER_USER = "${env.DEPLOY_SERVER_USER}"
        DEPLOY_SERVER_IP = "${env.DEPLOY_SERVER_IP}"
        APP_PORT = "80"
        APP_CONTAINER_NAME = "c1one-front-container"

        VITE_BYPASS_AUTH = "false"
        VITE_TEST_JWT = "true"
        VITE_API_BASE_URL = "http://localhost:8082/api"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    sh """
                    docker build \\
                        --build-arg VITE_BYPASS_AUTH=${env.VITE_BYPASS_AUTH} \\
                        --build-arg VITE_TEST_JWT=${env.VITE_TEST_JWT} \\
                        --build-arg VITE_API_BASE_URL=${env.VITE_API_BASE_URL} \\
                        -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} .
                    """
                }
            }
        }

        stage('Docker Push to GCR') {
            steps {
                script {
                    sh "docker tag ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ${env.DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"

                    sh 'gcloud auth configure-docker'
                    sh "docker push ${env.DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
                }
            }
        }

        stage('Deploy Application') {
             steps {
                script {
                    echo "Deploying Docker image ${env.DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} to VM"

                    withCredentials([
                        sshUserPrivateKey(credentialsId: 'my-gcp-ssh-key', keyFileVariable: 'SSH_KEY_PATH')
                    ]) {
                        sh """
                        ssh -o StrictHostKeyChecking=no -i ${SSH_KEY_PATH} ${env.DEPLOY_SERVER_USER}@${env.DEPLOY_SERVER_IP} << EOF

                            gcloud auth configure-docker gcr.io -q

                            docker stop ${env.APP_CONTAINER_NAME} || true
                            docker rm ${env.APP_CONTAINER_NAME} || true

                            docker pull ${env.DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}

                            docker run -d \\
                               -p ${env.APP_PORT}:80 \\
                               --name ${env.APP_CONTAINER_NAME} \\
                               --network c1one-network \\
                               --restart always \\
                               ${env.DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}

                            echo "Deployment script finished."
                            exit 0
                        EOF
                        """
                    }
                }
             }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
            cleanWs()
        }
        success {
            echo 'Build and Deployment succeeded!'
        }
        failure {
            echo 'Build or Deployment failed!'
        }
    }
}