import {Form, Formik} from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import {Button, Segment} from 'semantic-ui-react';
import * as Yup from 'yup';
import MyTextArea from '../../app/common/form/MyTextArea';
import MyTextInput from '../../app/common/form/MyTextInput';
import {PartialProfile, Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

interface Props {
    profile: Profile;
    setEditMode: (editMode: boolean) => void;
}

export default observer(function ProfileForm({profile, setEditMode}: Props) {
    const {profileStore: {updateProfile}} = useStore();
    
    const validationSchema = Yup.object({
        displayName: Yup.string().required('The display name is required'),
        bio: Yup.string()
    });
    
    function handleFormSubmit(profile: PartialProfile) {
        updateProfile(profile).then(() => setEditMode(false));
    }
    
    return (
        <Formik
            validationSchema={validationSchema}
            initialValues={new PartialProfile(profile)}
            onSubmit={values => handleFormSubmit(values)}
        >
            {({handleSubmit, isValid, isSubmitting, dirty}) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <MyTextInput name='displayName' placeholder='Display Name' />
                    <MyTextArea name='bio' placeholder='Bio' rows={3} />
                    <Button
                        disabled={!dirty || !isValid || isSubmitting}
                        loading={isSubmitting}
                        floated='right'
                        positive
                        type='submit'
                        content='Update profile'
                    />
                </Form>
            )}
        </Formik>
    )
})