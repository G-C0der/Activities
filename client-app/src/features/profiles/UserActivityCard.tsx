import React from 'react';
import { UserActivity } from '../../app/models/profile';
import {Link} from "react-router-dom";
import {Card, Icon, Image} from "semantic-ui-react";
import TextTruncate from "react-text-truncate";
import FollowButton from "./FollowButton";
import { format } from 'date-fns';

interface Props {
    activity: UserActivity;
}

export default function UserActivityCard({activity}: Props) {
    return (
        <Card as={Link} to={`/activities/${activity.id}`}>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
            <Card.Content textAlign='center'>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Description style={{color: "light-grey"}}>
                    {format(activity.date, 'dd MMM')}
                </Card.Description>
            </Card.Content>
        </Card>
    )
}