import { FC } from 'react';
import GetCalendarEvent from './get-all-event';
import AddCelendarEvent from './add-event';
import SubscriptionEvent from './subscription-event';

const OutlookCalendar: FC = () => {
  return (
    <>
      <AddCelendarEvent />
      <SubscriptionEvent />
      <GetCalendarEvent />
    </>
  );
};

export default OutlookCalendar;
