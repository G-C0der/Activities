import { observer } from 'mobx-react-lite';
import React from 'react';
import {Card, Grid, Tab } from 'semantic-ui-react';
import {useStore} from "../../app/stores/store";
import UserActivityCard from './UserActivityCard';

export default observer(function ProfileActivitiesItem() {
    const {profileStore: {activities, loadingActivities, clearActivities}} = useStore();
    
    return (
        <Tab.Pane loading={loadingActivities}>
            <Grid.Column width={16}>
                <Card.Group itemsPerRow={4}>
                    {activities.map(activity => (
                        <UserActivityCard key={activity.id} activity={activity} />
                    ))}
                </Card.Group>
            </Grid.Column>
        </Tab.Pane>
    )
})