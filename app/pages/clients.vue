<script setup lang="ts">
import { Users } from 'lucide-vue-next';
import { type ClientSchema } from '~~/shared/schemas/clients';

import { faker } from '@faker-js/faker';
import { countryCodes } from '~~/shared/consts/countries';
import { currencyCodes } from '~~/shared/consts/currencies';

const makeDummyClient = () => ({
  id: faker.string.uuid(),
  name: faker.company.name(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  billingAddress: faker.location.streetAddress(),
  shippingAddress: faker.location.streetAddress(),
  country: faker.helpers.arrayElement(countryCodes),
  taxTag: faker.lorem.word(),
  taxNumber: faker.finance.accountNumber(),
  currency: faker.helpers.arrayElement(currencyCodes),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});

const { data } = await useAsyncData<ClientSchema[]>('clientsFakeData', () =>
  Promise.all(Array.from({ length: 12 }, makeDummyClient))
);
</script>

<template>
  <AppPage title="Clients" :icon="Users">
    <ClientTable :clients="data" v-if="data" />
  </AppPage>
</template>
