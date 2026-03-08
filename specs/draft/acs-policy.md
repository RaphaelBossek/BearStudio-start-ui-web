```json
{
"Version": "2012-10-17",
"Statement": [
{
"Sid": "AllowDeletionOfServiceLinkedRoleForOrganizations",
"Effect": "Allow",
"Action": [
"iam:DeleteRole"
],
"Resource": [
"arn:aws:iam::*:role/aws-service-role/organizations.amazonaws.com/*"
]
},
{
"Sid": "AllowCreationOfServiceLinkedRoles",
"Effect": "Allow",
"Action": [
"iam:CreateServiceLinkedRole"
],
"Resource": "*"
}
]
}
```
https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsets.html?icmpid=docs_sso_console
Permission sets define the level of access that users in IAM Identity Center have to their assigned AWS accounts. The names of permission sets appear as available roles in the AWS access portal. Users who are assigned to multiple AWS permission sets can sign in to the AWS access portal, choose an account, and then choose a role that AWS created from an assigned permission set.
