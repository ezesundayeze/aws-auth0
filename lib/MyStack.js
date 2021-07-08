import * as sst from "@serverless-stack/resources";

export default class MyStack extends sst.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Create a HTTP API
    const api = new sst.Api(this, "Api", {
      defaultAuthorizationType: sst.ApiAuthorizationType.AWS_IAM,
      
      routes: {
        "GET /private": "src/lambda.handler",
      },

    });

    const auth = new sst.Auth(this, "Auth", {
      auth0: {
        domain: "dev-8wt5p93b.us.auth0.com",
        clientId: "2Ew7slhEmNyKEzHPJ4Et2iEJapw7dIry",
      }
    });
    
    // Show the endpoint in the output
    this.addOutputs({
      ApiEndpoint: api.url,
      IdentityPoolId: auth.cognitoCfnIdentityPool.ref,
    });

    // Allow authenticated users to invoke the API
    auth.attachPermissionsForAuthUsers([api]);
  }
}