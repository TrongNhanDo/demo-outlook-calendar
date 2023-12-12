import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import axios from 'axios';
import { FC, useCallback, useMemo } from 'react';

const SubscriptionEvent: FC = () => {
  const { instance, accounts } = useMsal();

  const subscriptionEndpoint = 'https://graph.microsoft.com/v1.0/subscriptions';
  const calendarId = localStorage.getItem('calendarId');
  const notificationUrl = 'https://dtnhan.cyclic.app/calendar/';
  const requestBody = useMemo(() => {
    return {
      changeType: 'created,updated,deleted',
      notificationUrl,
      resource: `me/calendars/${calendarId}/events`,
      expirationDateTime: '2023-12-31T00:00:00Z',
      clientState: 'secretClientValue',
    };
  }, [calendarId]);

  console.log({ calendarId });

  const accessTokenRequest = useMemo(() => {
    return {
      scopes: ['user.read', 'Calendars.ReadWrite'],
      account: accounts[0],
    };
  }, [accounts]);

  const handleSubmit = useCallback(() => {
    instance
      .acquireTokenSilent(accessTokenRequest)
      .then((accessTokenResponse) => {
        // Acquire token silent success
        const accessToken = accessTokenResponse.accessToken;
        // Call your API with token
        axios
          .post(subscriptionEndpoint, requestBody, {
            method: 'post',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response) => {
            console.log({ response });
          });
      })
      .catch((error) => {
        if (error instanceof InteractionRequiredAuthError) {
          instance
            .acquireTokenPopup(accessTokenRequest)
            .then(function (accessTokenResponse) {
              // Acquire token interactive success
              const accessToken = accessTokenResponse.accessToken;
              // Call your API with token
              axios.post(subscriptionEndpoint, requestBody, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });
            })
            .catch(function (error) {
              // Acquire token interactive failure
              console.log(error);
            });
        }
        console.log(error);
      });
  }, [instance, accessTokenRequest, requestBody]);

  return (
    <>
      <button style={{ margin: '0 12px 0 12px' }} onClick={handleSubmit}>
        Subscription Event
      </button>
    </>
  );
};

export default SubscriptionEvent;
