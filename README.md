# foodops

### Requirements
* Install Node
* Install Docker
* Install Docker Compose
* Install AWS CLI

### Clone the repository
```
git clone https://github.com/ArunSingh94/foodops.git
```
### Go to root of foodops repository
```
cd foodops
```
### Install Node dependencies
```
npm install
```
### Generate your own AWS key pair in the AWS console and replace the one in this folder
### Change file permission of your key pair
```
chmod 400 <your key pair name>.pem
```
### Replace the KeyName of the key pair in stack.yml with your key pair name
```
KeyName: <your key pair name>.pem
```
### Create the AWS Cloud Formation stack
```
aws cloudformation create-stack --stack-name <stack name here>  --template-body file://$PWD/stack.yml
```
### Copy/Paste AWS RDS endpoint into .env file
When the stack creation has completed, go to the RDS instance and copy the endpoint and paste it as the new DB_HOST variable
Your .env file should look similiar to this:
```
DB_USER=group5
DB_NAME=foodopsdb
DB_PASS=password123
DB_HOST=<your RDS endpoint>
```
### Replace the image name in app.yml
```
image: <your docker hub account name>/foodops
```
### Build the Docker image
```
docker build -t <your dockerhub account name>/foodops .
```
### Push the Docker image to your DockerHub
```
docker push <your dockerhub account name>/foodops
```
### Get the EC2 instance IPv4 Publid IP address from your stack and use it to test connection
```
docker -H tcp://<your IP address>:2375 ps -a
```
### Run the node database migration
```
docker-compose -H tcp://<your IP address>:2375 -f app.yml run --rm app node node_modules/db-migrate/bin/db-migrate up --config ./config/dev.json
```
### Create the docker container service
```
docker-compose -H tcp://<your IP address>:2375 -f app.yml up -d
```
### Check if your container service is running
```
docker-compose -H tcp://<your IP address>:2375 -f app.yml ps
```
Your output should look like this:
```
    Name                   Command               State          Ports        
-----------------------------------------------------------------------------
foodops_app_1   docker-entrypoint.sh npm s ...   Up      0.0.0.0:80->8080/tcp
```
### Get the EC2 instance Public DNS address and go to the URL
It should look similiar to this:
```
ec2-54-156-67-249.compute-1.amazonaws.com
```
You should now be on the FoodOps website Home page
### Create an Account
* Click on the Registration tab in the navigation bar and enter your account information and select a subscription plan
* Click the submit button
* You will be directed to the Profile page
### Profile page
* The Account Information table lists all the data you just entered
* The Change Subscription Plan section states your current plan and you can change it at anytime
* The Service History table lists all the services provisioned by all your plans
### Change Subscription Plan
* Click on the drop down menu and select a new plan
* The Service History table will automatically be updated with your newly provisioned services
