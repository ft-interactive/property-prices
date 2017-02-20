import article from './article';
import getFlags from './flags';
import axios from 'axios';
import getOnwardJourney from './onward-journey';

export default async () => {
  const d = await article();
  const flags = await getFlags();
  const onwardJourney = await getOnwardJourney();
  const endpoint = 'http://bertha.ig.ft.com/view/publish/gss/10rzZIkNjPuU4WomzTMIjfb4nW5WlI1VCxjgc9lfrGow/data';
  
  let propertyData;

  try {
    const res = await axios(endpoint);
    propertyData = res.data;
  } catch (e) {
    console.log('Error getting content from Bertha');
  }

  console.log(propertyData);

  return {
    ...d,
    flags,
    onwardJourney,
    propertyData
  };
};
