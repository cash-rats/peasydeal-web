import { BrowserRouter as Router } from 'react-router-dom';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import TrackOrderHeader from './components/TrackOrderHeader';

function TrackOrderHeaderWithRouter() {
  return (
    <Router>
      <TrackOrderHeader />
    </Router>
  );
}


export default {
  title: 'Track Order Header',
  component: TrackOrderHeaderWithRouter,
} as ComponentMeta<typeof TrackOrderHeaderWithRouter>

const Template: ComponentStory<typeof TrackOrderHeaderWithRouter> = (args) => (
  <TrackOrderHeaderWithRouter />
);

export const TrackOrderHeaderStory = Template.bind({});
TrackOrderHeaderStory.args = {
  value: 1000,
};

