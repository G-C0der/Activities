import { observer } from 'mobx-react-lite';
import React, {SyntheticEvent, useEffect } from 'react';
import { useStore } from '../../app/stores/store';
import { Tab, Header, TabProps, Grid, Card, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const panes = [
    { menuItem: 'Future Events', pane: { key: 'future' } },
    { menuItem: 'Past Events', pane: { key: 'past' } },
    { menuItem: 'Hosting', pane: { key: 'hosting' } }
]

export default observer(function ProfileActivities() {
    const {profileStore: {
        loadActivities,
        loadingActivities,
        activities
    }} = useStore();
    
    useEffect(() => {
        loadActivities();
    }, [loadActivities])

    const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
        loadActivities(panes[data.activeIndex as number].pane.key);
    };
    
    return (
        <Tab.Pane loading={loadingActivities}>
            <Grid.Column width={16}>
                <Header
                    floated='left'
                    icon='calendar'
                    content='Activities'
                />
            </Grid.Column>
            <Tab
                menu={{secondary: true, pointing: true}}
                panes={panes}
                onTabChange={(e, data) => handleTabChange(e, data)}
            />
            <br />
            <Card.Group itemsPerRow={4}>
                {activities.map(activity => (
                    <Card
                        as={Link}
                        to={`/activities/${activity.id}`}
                        key={activity.id}
                    >
                        <Image
                            src={`/assets/categoryImages/${activity.category}.jpg`}
                            style={{ minHeight: 100, objectFit: 'cover' }}
                        />
                        <Card.Content>
                            <Card.Header
                                textAlign='center'>{activity.title}</Card.Header>
                            <Card.Meta textAlign='center'>
                                <div>{format(new Date(activity.date), 'do LLL')}</div>
                                <div>{format(new Date(activity.date), 'h:mm a')}</div>
                            </Card.Meta>
                        </Card.Content>
                    </Card>
                ))}
            </Card.Group>
        </Tab.Pane>
    )
})