import React from 'react';
import {Message} from "semantic-ui-react";

interface Props {
    errors: any;
}

export default function ValidationErrors({errors}: Props) {
    console.log(errors)
    return (
        <Message error>
            
        </Message>
    )
}