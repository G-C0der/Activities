import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import {Button, Grid, GridColumn, Header, Tab} from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import ProfileForm from './ProfileForm';

interface Props {
    profile: Profile;
}

export default function ProfileAbout({profile}: Props) {
    const [editMode, setEditMode] = useState(false);
    
    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='user' content={`About ${profile.displayName}`} />
                    <Button
                        floated='right' basic
                        content={editMode ? 'Cancel' : 'Edit Profile'}
                        onClick={() => setEditMode(!editMode)}
                    />
                </Grid.Column>
                <GridColumn width={16}>
                    {editMode ? (
                        <ProfileForm profile={profile} setEditMode={setEditMode} />
                    ) : (
                        <span style={{whiteSpace: "pre-wrap"}}>{profile.bio}</span>
                    )}
                </GridColumn>
            </Grid>
        </Tab.Pane>
    )
}