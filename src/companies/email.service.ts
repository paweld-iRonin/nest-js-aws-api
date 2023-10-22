import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

@Injectable()
export class EmailService {
    constructor(private readonly configService: ConfigService) {}

    async send(email: string) {
      const client = new SESClient({
        region: this.configService.getOrThrow('AWS_REGION'),
        credentials: {
          accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
          secretAccessKey: this.configService.getOrThrow('AWS_SECRET_KEY_ID'),
        },
      });

      const input = {
        "Destination": {
          "BccAddresses": [],
          "CcAddresses": [],
          "ToAddresses": [email]
        },
        "Message": {
          "Body": {
            "Html": {
              "Charset": "UTF-8",
              "Data": "This message body contains HTML formatting. It can, for example, contain links like this one: <a class=\"ulink\" href=\"http://docs.aws.amazon.com/ses/latest/DeveloperGuide\" target=\"_blank\">Amazon SES Developer Guide</a>."
            },
            "Text": {
              "Charset": "UTF-8",
              "Data": "This is the message body in text format."
            }
          },
          "Subject": {
            "Charset": "UTF-8",
            "Data": "Test email"
          }
        },
        "ReplyToAddresses": ["pawel.dabrowski@ironin.pl"],
        "Source": "pawel.dabrowski@ironin.pl",
      };

      const command = new SendEmailCommand(input);
      return await client.send(command);
    }
}
