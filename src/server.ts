import app from './app'
import { consoleColors } from './utils/helpers'

const port = process.env.PORT

app.listen(port, async () => {
  console.log(
    consoleColors.Green,
    `Server running on: ${process.env.APP_URL}.\n`,
  )

  // console.log(consoleColors.Green, `Setting eazy webhook url....\n`);
  // const appUrl = process.env.APP_URL;

  // //Quando não tem url
  // if (!appUrl || appUrl?.length === 0)
  //   throw new Error("Application missing environment variable 'APP_URL'.");

  // const currentOrganizationResponse =
  //   await eazyProvider.apiInstance.get<Eazy.Api.GetCurrentOrganization.Response>(
  //     "/organizations/current"
  //   );

  // await eazyProvider.apiInstance
  //   .put("/organizations/current", {
  //     webhookNotificationUri: `${appUrl}/notification`,
  //     webhookNotificationToken:
  //       currentOrganizationResponse.data.organization
  //         .webhookNotificationToken,
  //   })
  //   .then((res) => {
  //     // eslint-disable-next-line no-console
  //     if (res.status === 200) console.log("Successfully set webhook url.");
  //   });
})
