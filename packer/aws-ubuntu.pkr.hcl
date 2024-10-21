packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0, <2.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-0866a3c8686eaeeba"
}

variable "ssh_username" {
  type    = string
  default = "ubuntu"
}

variable "subnet_id" {
  type    = string
  default = "subnet-0b1ad1a4200f65a15"
}

variable "instance_type" {
  type    = string
  default = "t2.small"
}

variable "vpc_id" {
  type    = string
  default = "vpc-0eafab646c53a7c84"
}

variable "db_name" {
  type    = string
  default = "user"
}

variable "db_password" {
  type    = string
  default = "2404"
}

variable "github_token" {
  type    = string
  default = ""
}

variable "github_repo" {
  type    = string
  default = "csye6225-cloud-neu/webapp"
}

variable "db_username" {
  type    = string
  default = "root"
}

variable "db_host" {
  type    = string
  default = "localhost"
}

variable "port" {
  type    = string
  default = "8080"
}

variable "db_dialect" {
  type    = string
  default = "mysql"
}

// build an AMI
source "amazon-ebs" "ubuntu" {
  ami_name                    = "csye6225-ubuntu-ami_${formatdate("YYYY-MM-DD", timestamp())}"
  ami_description             = "CSYE6225 Ubuntu AMI"
  region                      = "${var.aws_region}"
  instance_type               = "${var.instance_type}"
  source_ami                  = "${var.source_ami}"
  ssh_username                = "${var.ssh_username}"
  subnet_id                   = "${var.subnet_id}"
  vpc_id                      = "${var.vpc_id}"
  associate_public_ip_address = true

  ami_regions = ["${var.aws_region}"]

  // storage attached to the vm
  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sda1"
    volume_size           = 25
    volume_type           = "gp2"
  }
}

build {
  name = "csye6225-ubuntu-ami"
  sources = [
    "source.amazon-ebs.ubuntu"
  ]

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive", // disable interactive prompts
      "CHECKPOINT_DISABLE=1",           // disable calls to checkpoint.hashicorp.com
    ]
    inline = [
      "sudo apt-get update",
      // "sudo apt upgrade -y",
      "sudo apt-get install -y unzip nodejs npm mysql-server",
      "sudo apt-get clean",

      # Create a new group and user
      "sudo groupadd csye6225",
      "sudo useradd -g csye6225 -s /usr/sbin/nologin csye6225",

      # download the app artifact and unzip it
      "curl -H \"Authorization: token ${var.github_token}\" -L \"https://api.github.com/repos/${var.github_repo}/actions/artifacts\" | jq -r '.artifacts[0].archive_download_url' | xargs -n 1 curl -H \"Authorization: token ${var.github_token}\" -L -o webapp.zip",

      "sudo unzip webapp.zip -d /opt/webapp",
      "cd /opt/webapp && sudo unzip webapp.zip",
      "sudo chown -R csye6225:csye6225 /opt/webapp",

      # copy the systemd service file and enable it
      "sudo cp /opt/webapp/packer/systemd/app.service /etc/systemd/system/",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable app.service",

      # create the database user
      "sudo mysql -e \"CREATE DATABASE ${var.db_name};\"",

      # set the root password for mysql and start the service
      "sudo mysql -e \"ALTER USER 'root'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY '${var.db_password}';\"",
      "sudo systemctl start mysql",

      "cd /opt/webapp",
      "sudo npm install",
      "sudo ufw allow 3306",
      "sudo ufw allow 8080",

      "export $(grep -v '^#' /path/to/.env | xargs -d '\n')",
      "sudo echo 'export DB_NAME=${var.db_name}' >> /home/ubuntu/.bashrc",
      "sudo echo 'export DB_HOST=${var.db_host}' >> /home/ubuntu/.bashrc",
      "sudo echo 'export DB_USERNAME=${var.db_username}' >> /home/ubuntu/.bashrc",
      "sudo echo 'export DB_PASSWORD=${var.db_password}' >> /home/ubuntu/.bashrc",
      "sudo echo 'export PORT=${var.port}' >> /home/ubuntu/.bashrc",
      "sudo echo 'export DB_DIALECT=${var.db_dialect}' >> /home/ubuntu/.bashrc",

      "sudo npm start"
    ]
  }
}