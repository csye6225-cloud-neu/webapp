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
  default = "t2.micro"
}

variable "vpc_id" {
  type    = string
  default = "vpc-0eafab646c53a7c84"
}

variable "demo_account_id" {
  type    = string
  default = "051826718120"
}

// build an AMI
source "amazon-ebs" "ubuntu" {
  ami_name                    = "csye6225-ubuntu-ami_${formatdate("YYYY-MM-DD HH.mmaa", timestamp())}"
  ami_description             = "CSYE6225 Ubuntu AMI"
  region                      = "${var.aws_region}"
  instance_type               = "${var.instance_type}"
  source_ami                  = "${var.source_ami}"
  ssh_username                = "${var.ssh_username}"
  subnet_id                   = "${var.subnet_id}"
  vpc_id                      = "${var.vpc_id}"
  ami_users                   = ["${var.demo_account_id}"]
  ami_regions                 = ["${var.aws_region}"]
  associate_public_ip_address = true

  tags = {
    Name = "csye6225-ubuntu-ami"
  }

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

  provisioner "file" {
    source      = "./webapp.zip"
    destination = "./webapp.zip"
  }

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive", // disable interactive prompts
      "CHECKPOINT_DISABLE=1",           // disable calls to checkpoint.hashicorp.com
    ]
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y unzip nodejs npm mysql-client",
      "sudo apt-get clean",

      # install and start the CloudWatch agent
      "wget https://amazoncloudwatch-agent-us-east-1.s3.us-east-1.amazonaws.com/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb",
      "sudo dpkg -i -E ./amazon-cloudwatch-agent.deb",

      # create a new group and user
      "sudo groupadd csye6225",
      "sudo useradd -g csye6225 -s /usr/sbin/nologin csye6225",

      "sudo unzip webapp.zip -d /opt/webapp",
      "cd /opt/webapp && sudo unzip webapp.zip",
      "sudo rm -f webapp.zip",

      # move the CloudWatch agent configuration file
      "sudo mv /opt/webapp/app/config/cloudwatch-agent.json /opt/cloudwatch-agent.json",

      "sudo chown -R csye6225:csye6225 /opt/webapp",
      "sudo npm install",

      # copy the systemd service file and enable it
      "sudo cp /opt/webapp/packer/systemd/app.service /etc/systemd/system/",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable app.service",
    ]
  }
}