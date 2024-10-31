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

variable "github_token" {
  type    = string
  default = ""
}

variable "github_repo" {
  type    = string
  default = "csye6225-cloud-neu/webapp"
}

variable "demo_account_id" {
  type    = string
  default = "051826718120"
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
  ami_users                   = ["${var.demo_account_id}"]
  associate_public_ip_address = true

  ami_regions = ["${var.aws_region}"]

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

      # download the app artifact and unzip it
      "curl -H \"Authorization: token ${var.github_token}\" -L \"https://api.github.com/repos/${var.github_repo}/actions/artifacts\" | jq -r '.artifacts[0].archive_download_url' | xargs -n 1 curl -H \"Authorization: token ${var.github_token}\" -L -o webapp.zip",

      "sudo unzip webapp.zip -d /opt/webapp",
      "cd /opt/webapp && sudo unzip webapp.zip",
      "sudo rm -f /opt/webapp/webapp.zip",
      # move the CloudWatch agent configuration file
      "sudo mv ./app/config/cloudwatch-agent.json /opt/cloudwatch-agent.json",

      "sudo chown -R csye6225:csye6225 /opt/webapp",
      "cd /opt/webapp",
      "sudo npm install",

      # copy the systemd service file and enable it
      "sudo cp /opt/webapp/packer/systemd/app.service /etc/systemd/system/",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable app.service",
    ]
  }
}