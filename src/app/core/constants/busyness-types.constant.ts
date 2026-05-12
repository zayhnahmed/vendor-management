import { BusinessType, EntityType } from "../enums/business.enum";


export const ENTITY_TYPE_OPTIONS = [
  { label: 'Government', value: EntityType.GOVERNMENT },
  { label: 'Private', value: EntityType.PRIVATE },
  { label: 'Public', value: EntityType.PUBLIC },
  { label: 'PIF Related Party', value: EntityType.PIFRELATED },
  { label: 'Individual', value: EntityType.INDIVIDUAL },
];


export const BUSINESS_TYPE_OPTIONS = [
  { label: 'Contractor', value: BusinessType.CONTRACTOR },
  { label: 'Consultant', value: BusinessType.CONSULTANT },
  { label: 'Supplier', value: BusinessType.SUPPLIER },
  { label: 'FFF & OSE', value: BusinessType.FFF_OSE },
  { label: 'Freelancer', value: BusinessType.SOLE_TRADER },
];