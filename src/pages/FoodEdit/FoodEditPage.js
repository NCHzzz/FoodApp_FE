import { useNavigate, useParams } from 'react-router-dom';
import classes from './FoodEditPage.module.css';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { add, getById, update } from '../../services/foodService';
import Title from '../../Components/Title/Title';
import InputContainer from '../../Components/InputContainer/InputContainer';
import Input from '../../Components/Input/Input';
import Button from '../../Components/Button/Button';
import { uploadImage } from '../../services/uploadService';
import { toast } from 'react-toastify';

export default function FoodEditPage() {
    const { foodId } = useParams();
    const [imageUrl, setImageUrl] = useState();
    const isEditMode = !!foodId;

  const navigate = useNavigate();
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        if (!isEditMode) return;

        getById(foodId).then(food => {
            if(!food) return;
            reset(food);
            setImageUrl(food.imageUrl);
        });
    }, [foodId]);

    const submit = async foodData => {
        const food = { ...foodData, imageUrl };
    
        if (isEditMode) {
          await update(food);
          toast.success(`Food "${food.name}" updated successfully!`);
          navigate('/admin/foods/');
          return;
        }
    
        const newFood = await add(food);
        toast.success(`Food "${food.name}" added successfully!`);
        navigate('/admin/foods/');
    };

    const upload = async event => {
        setImageUrl(null);
        const imageUrl = await uploadImage(event);
        setImageUrl(imageUrl);
    };


    return (
        <div className={classes.container}>
            <div className={classes.content}>
                <Title title={isEditMode ? 'Edit Food' : 'Add Food'} />
                <form onSubmit={handleSubmit(submit)} noValidate>
                    <InputContainer label='Select Image'>
                        <input type='file' onChange={upload} accept='img/jpeg' />
                    </InputContainer>

                    {imageUrl && (
                        <a 
                            href={imageUrl} 
                            className={classes.image_link} 
                            target='blank'
                        >
                            <img src={`/${imageUrl}`} alt='Uploaded' />
                        </a>
                    )}

                    <Input
                         input="text"
                         label="Name" 
                         {...register('name', {required: true, minLength: 5} )}
                         error={errors.name}
                    />

                    <Input
                        type="number"
                        label="Price"
                        {...register('price', { required: true })}
                        error={errors.price}
                    />

                    <Input
                        type="select"
                        label="Tags"
                        {...register('tags', { required: true })}
                        error={errors.tags}
                    />
                                                
                    <Input
                        type="number"
                        label="Stars"
                        {...register('stars', { required: true, min: 1, max: 5 })}
                        error={errors.stars}
                    />

                    <Input
                        type="checkbox"
                        label="Favorite"
                        {...register('favorite')}
                        error={errors.favorite}
                    />

                    <Input
                        type="text"
                        label="Cook Time"
                        {...register('cookTime', { required: true })}
                        error={errors.cookTime}
                    />
                    <Button type="submit" backgroundColor='darkred' text={isEditMode ? 'Update' : 'Create'} />
                </form>
            </div>
        </div>
    );
}
