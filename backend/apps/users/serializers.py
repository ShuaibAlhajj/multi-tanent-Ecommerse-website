from rest_framework import serializers

from apps.stores.models import Store
from apps.users.models import Customer, User


class UserSerializer(serializers.ModelSerializer):
    store_id = serializers.IntegerField(source='store.id', read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'first_name',
            'last_name',
            'phone',
            'role',
            'store_id',
        ]


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            'id',
            'store',
            'user',
            'first_name',
            'last_name',
            'email',
            'phone',
            'address',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class RegisterSerializer(serializers.Serializer):
    store_id = serializers.IntegerField()
    email = serializers.EmailField()
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=80)
    last_name = serializers.CharField(max_length=80, required=False, allow_blank=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=User.Roles.choices, default=User.Roles.CUSTOMER)

    def validate_store_id(self, value):
        if not Store.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError('Store not found or inactive.')
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('This username is already taken.')
        return value

    def create(self, validated_data):
        store = Store.objects.get(id=validated_data['store_id'])

        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            role=validated_data.get('role', User.Roles.CUSTOMER),
            store=store,
        )

        Customer.objects.get_or_create(
            store=store,
            email=user.email,
            defaults={
                'user': user,
                'first_name': user.first_name or user.username,
                'last_name': user.last_name,
                'phone': user.phone,
            },
        )

        return user
