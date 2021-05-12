import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useStore } from '../../app/stores/store';
import { Tab, Header, Segment } from 'semantic-ui-react';
import ProfileActivitiesItem from './ProfileActivitiesItem';


export default observer(function ProfileActivities() {
    const {profileStore: {setActiveActivityTab, clearActivities}} = useStore();
    
    useEffect(() => {
        setActiveActivityTab(0);
        return () => clearActivities();
    }, [setActiveActivityTab, clearActivities])
    
    const panes = [
        {menuItem: 'Future Events', render: () => <ProfileActivitiesItem />},
        {menuItem: 'Past Events', render: () => <ProfileActivitiesItem />},
        {menuItem: 'Hosting', render: () => <ProfileActivitiesItem />},
    ]
    
    return (
        <Segment>
            <Header
                floated='left'
                icon='calendar'
                content='Activities'
            />
            <Tab
                menu={{fluid: true}}
                panes={panes}
                onTabChange={(e, data) => setActiveActivityTab(data.activeIndex)}
            />
        </Segment>
    )
})