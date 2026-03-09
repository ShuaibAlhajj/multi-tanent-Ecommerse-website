from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from apps.products.models import Category, Product
from apps.stores.models import Store
from apps.users.models import User


class Command(BaseCommand):
    help = 'Seeds a default store with categories, products, and an admin user.'

    def add_arguments(self, parser):
        parser.add_argument('--admin-email', default='admin@northstar.local')
        parser.add_argument('--admin-password', default='Admin12345!')

    @transaction.atomic
    def handle(self, *args, **options):
        store, _ = Store.objects.get_or_create(
            slug='northstar',
            defaults={
                'name': 'Northstar Store',
                'domain': 'localhost',
                'is_active': True,
                'settings': {
                    'currency': 'USD',
                    'theme': 'default',
                },
            },
        )

        category_names = ['Apparel', 'Accessories', 'Tech']
        categories = {}
        for name in category_names:
            category, _ = Category.objects.get_or_create(
                store=store,
                slug=slugify(name),
                defaults={
                    'name': name,
                    'description': f'{name} catalog items',
                    'is_active': True,
                },
            )
            categories[name] = category

        products = [
            {
                'name': 'Northstar Hoodie',
                'slug': 'northstar-hoodie',
                'sku': 'NST-HOODIE-001',
                'price': Decimal('79.00'),
                'stock_qty': 120,
                'category': categories['Apparel'],
                'image': 'products/product-a.svg',
            },
            {
                'name': 'Canvas Utility Bag',
                'slug': 'canvas-utility-bag',
                'sku': 'NST-BAG-001',
                'price': Decimal('45.00'),
                'stock_qty': 200,
                'category': categories['Accessories'],
                'image': 'products/product-b.svg',
            },
            {
                'name': 'Wireless Dock Pro',
                'slug': 'wireless-dock-pro',
                'sku': 'NST-DOCK-001',
                'price': Decimal('129.00'),
                'stock_qty': 80,
                'category': categories['Tech'],
                'image': 'products/product-c.svg',
            },
        ]

        for product_data in products:
            Product.objects.get_or_create(
                store=store,
                sku=product_data['sku'],
                defaults={
                    'name': product_data['name'],
                    'slug': product_data['slug'],
                    'description': f"Premium {product_data['name']} for high-conversion ecommerce stores.",
                    'price': product_data['price'],
                    'currency': 'USD',
                    'stock_qty': product_data['stock_qty'],
                    'category': product_data['category'],
                    'image': product_data['image'],
                    'is_active': True,
                },
            )

        admin_email = options['admin_email']
        admin_password = options['admin_password']
        admin_user, created = User.objects.get_or_create(
            email=admin_email,
            defaults={
                'username': 'store_admin',
                'first_name': 'Store',
                'last_name': 'Admin',
                'role': User.Roles.ADMIN,
                'store': store,
                'is_staff': True,
                'is_superuser': True,
            },
        )

        if created:
            admin_user.set_password(admin_password)
            admin_user.save(update_fields=['password'])
            self.stdout.write(self.style.SUCCESS(f'Created admin user: {admin_email}'))
        else:
            self.stdout.write('Admin user already exists; password unchanged.')

        self.stdout.write(self.style.SUCCESS(f'Seed complete for store id={store.id} ({store.name})'))
