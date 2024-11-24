import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const HospitalScalarFieldEnumSchema = z.enum(['id','hospitalName','phoneNumber','createdAt','updatedAt']);

export const DepartmentScalarFieldEnumSchema = z.enum(['id','name','hospitalId','roleId','updatedBy','createdAt','updatedAt']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','phoneNumber','hospitalId','department','isActive','updatedBy','createdAt','updatedAt']);

export const UserLoginScalarFieldEnumSchema = z.enum(['userId','password','updatedBy','createdAt','updatedAt']);

export const RoleScalarFieldEnumSchema = z.enum(['id','roleName','description','hospitalId','isSuperAdmin','updatedBy','createdAt','updatedAt']);

export const UserRoleScalarFieldEnumSchema = z.enum(['id','userId','roleId','updatedBy','createdAt']);

export const PermissionScalarFieldEnumSchema = z.enum(['id','permissionName','description','hospitalId','updatedBy','createdAt','updatedAt']);

export const RolePermissionScalarFieldEnumSchema = z.enum(['id','roleId','permissionId','updatedBy','createdAt','updatedAt']);

export const VendorScalarFieldEnumSchema = z.enum(['id','name','phoneNumber','email','address','gstNumber','branchName','hospitalId','updatedBy','createdAt','updatedAt']);

export const ProductScalarFieldEnumSchema = z.enum(['id','name','sku','hsnCode','genericName','brandName','manufacturer','dosageForm','strength','purchaseRate','saleRate','mrp','maxDiscount','hospitalId','updatedBy','createdAt','updatedAt']);

export const ProductDepartmentScalarFieldEnumSchema = z.enum(['id','productId','departmentId','updatedBy','createdAt','updatedAt']);

export const IntentTrackScalarFieldEnumSchema = z.enum(['id','hospitalId','statusId','color','updatedBy','createdAt','updatedAt']);

export const IntentStatusScalarFieldEnumSchema = z.enum(['id','name','updatedBy','createdAt','updatedAt']);

export const ProductIntentScalarFieldEnumSchema = z.enum(['id','productId','intentId','trackId','hospitalId','updatedBy','createdAt','updatedAt']);

export const PatientScalarFieldEnumSchema = z.enum(['uhid','name','gender','mobile','hospitalId','dob','bornYear','aadharNumber','aadharName','bloodGroup','address','city','pincode','updatedBy','createdAt','updatedAt','isDeleted','fatherName']);

export const PatientVisitScalarFieldEnumSchema = z.enum(['id','uhid','hospitalId','departmentId','doctorId','checkInTime','checkOutTime','isDeleted','updatedBy','createdAt','updatedAt']);

export const AssessmentScalarFieldEnumSchema = z.enum(['id','uhid','doctorId','patientVisitId','complaint','currentMedication','pastMedicalHistory','examination','investigation','procedureDone','diagnosis','treatmentGiven','followUp','followupInstruction','isDeleted','updatedBy','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const GenderSchema = z.enum(['MALE','FEMALE','OTHER']);

export type GenderType = `${z.infer<typeof GenderSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// HOSPITAL SCHEMA
/////////////////////////////////////////

export const HospitalSchema = z.object({
  id: z.number().int(),
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Hospital = z.infer<typeof HospitalSchema>

/////////////////////////////////////////
// DEPARTMENT SCHEMA
/////////////////////////////////////////

export const DepartmentSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  hospitalId: z.number().int(),
  roleId: z.number().int(),
  updatedBy: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Department = z.infer<typeof DepartmentSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  hospitalId: z.number().int(),
  department: z.number().int(),
  isActive: z.boolean(),
  updatedBy: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER LOGIN SCHEMA
/////////////////////////////////////////

export const UserLoginSchema = z.object({
  userId: z.string(),
  password: z.string(),
  updatedBy: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type UserLogin = z.infer<typeof UserLoginSchema>

/////////////////////////////////////////
// ROLE SCHEMA
/////////////////////////////////////////

export const RoleSchema = z.object({
  id: z.number().int(),
  roleName: z.string(),
  description: z.string().nullable(),
  hospitalId: z.number().int(),
  isSuperAdmin: z.boolean().nullable(),
  updatedBy: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Role = z.infer<typeof RoleSchema>

/////////////////////////////////////////
// USER ROLE SCHEMA
/////////////////////////////////////////

export const UserRoleSchema = z.object({
  id: z.number().int(),
  userId: z.string(),
  roleId: z.number().int(),
  updatedBy: z.string().nullable(),
  createdAt: z.coerce.date(),
})

export type UserRole = z.infer<typeof UserRoleSchema>

/////////////////////////////////////////
// PERMISSION SCHEMA
/////////////////////////////////////////

export const PermissionSchema = z.object({
  id: z.number().int(),
  permissionName: z.string(),
  description: z.string().nullable(),
  hospitalId: z.number().int(),
  updatedBy: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Permission = z.infer<typeof PermissionSchema>

/////////////////////////////////////////
// ROLE PERMISSION SCHEMA
/////////////////////////////////////////

export const RolePermissionSchema = z.object({
  id: z.number().int(),
  roleId: z.number().int(),
  permissionId: z.number().int(),
  updatedBy: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type RolePermission = z.infer<typeof RolePermissionSchema>

/////////////////////////////////////////
// VENDOR SCHEMA
/////////////////////////////////////////

export const VendorSchema = z.object({
  id: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  address: z.string(),
  gstNumber: z.string(),
  branchName: z.string(),
  hospitalId: z.number().int(),
  updatedBy: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Vendor = z.infer<typeof VendorSchema>

/////////////////////////////////////////
// PRODUCT SCHEMA
/////////////////////////////////////////

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  hsnCode: z.string(),
  genericName: z.string(),
  brandName: z.string(),
  manufacturer: z.string(),
  dosageForm: z.string(),
  strength: z.string(),
  purchaseRate: z.number(),
  saleRate: z.number(),
  mrp: z.number(),
  maxDiscount: z.number(),
  hospitalId: z.number().int(),
  updatedBy: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Product = z.infer<typeof ProductSchema>

/////////////////////////////////////////
// PRODUCT DEPARTMENT SCHEMA
/////////////////////////////////////////

export const ProductDepartmentSchema = z.object({
  id: z.number().int(),
  productId: z.string(),
  departmentId: z.number().int(),
  updatedBy: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ProductDepartment = z.infer<typeof ProductDepartmentSchema>

/////////////////////////////////////////
// INTENT TRACK SCHEMA
/////////////////////////////////////////

export const IntentTrackSchema = z.object({
  id: z.number().int(),
  hospitalId: z.number().int(),
  statusId: z.number().int(),
  color: z.string(),
  updatedBy: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type IntentTrack = z.infer<typeof IntentTrackSchema>

/////////////////////////////////////////
// INTENT STATUS SCHEMA
/////////////////////////////////////////

export const IntentStatusSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  updatedBy: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type IntentStatus = z.infer<typeof IntentStatusSchema>

/////////////////////////////////////////
// PRODUCT INTENT SCHEMA
/////////////////////////////////////////

export const ProductIntentSchema = z.object({
  id: z.string(),
  productId: z.string(),
  intentId: z.number().int(),
  trackId: z.number().int(),
  hospitalId: z.number().int(),
  updatedBy: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ProductIntent = z.infer<typeof ProductIntentSchema>

/////////////////////////////////////////
// PATIENT SCHEMA
/////////////////////////////////////////

export const PatientSchema = z.object({
  gender: GenderSchema,
  uhid: z.string(),
  name: z.string(),
  mobile: z.string(),
  hospitalId: z.number().int(),
  dob: z.coerce.date().nullable(),
  bornYear: z.number().int().nullable(),
  aadharNumber: z.string().nullable(),
  aadharName: z.string().nullable(),
  bloodGroup: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  pincode: z.string().nullable(),
  updatedBy: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  isDeleted: z.boolean(),
  fatherName: z.string(),
})

export type Patient = z.infer<typeof PatientSchema>

/////////////////////////////////////////
// PATIENT VISIT SCHEMA
/////////////////////////////////////////

export const PatientVisitSchema = z.object({
  id: z.string(),
  uhid: z.string(),
  hospitalId: z.number().int(),
  departmentId: z.number().int(),
  doctorId: z.string(),
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date(),
  isDeleted: z.boolean(),
  updatedBy: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type PatientVisit = z.infer<typeof PatientVisitSchema>

/////////////////////////////////////////
// ASSESSMENT SCHEMA
/////////////////////////////////////////

export const AssessmentSchema = z.object({
  id: z.string(),
  uhid: z.string(),
  doctorId: z.string(),
  patientVisitId: z.string(),
  complaint: z.string(),
  currentMedication: z.string(),
  pastMedicalHistory: z.string(),
  examination: z.string(),
  investigation: z.string(),
  procedureDone: z.string(),
  diagnosis: JsonValueSchema,
  treatmentGiven: z.string(),
  followUp: z.coerce.date(),
  followupInstruction: z.string(),
  isDeleted: z.boolean(),
  updatedBy: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Assessment = z.infer<typeof AssessmentSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// HOSPITAL
//------------------------------------------------------

export const HospitalIncludeSchema: z.ZodType<Prisma.HospitalInclude> = z.object({
  Department: z.union([z.boolean(),z.lazy(() => DepartmentFindManyArgsSchema)]).optional(),
  IntentTrack: z.union([z.boolean(),z.lazy(() => IntentTrackFindManyArgsSchema)]).optional(),
  PatientVisit: z.union([z.boolean(),z.lazy(() => PatientVisitFindManyArgsSchema)]).optional(),
  Permission: z.union([z.boolean(),z.lazy(() => PermissionFindManyArgsSchema)]).optional(),
  Product: z.union([z.boolean(),z.lazy(() => ProductFindManyArgsSchema)]).optional(),
  ProductIntent: z.union([z.boolean(),z.lazy(() => ProductIntentFindManyArgsSchema)]).optional(),
  Role: z.union([z.boolean(),z.lazy(() => RoleFindManyArgsSchema)]).optional(),
  User: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  Vendor: z.union([z.boolean(),z.lazy(() => VendorFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => HospitalCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const HospitalArgsSchema: z.ZodType<Prisma.HospitalDefaultArgs> = z.object({
  select: z.lazy(() => HospitalSelectSchema).optional(),
  include: z.lazy(() => HospitalIncludeSchema).optional(),
}).strict();

export const HospitalCountOutputTypeArgsSchema: z.ZodType<Prisma.HospitalCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => HospitalCountOutputTypeSelectSchema).nullish(),
}).strict();

export const HospitalCountOutputTypeSelectSchema: z.ZodType<Prisma.HospitalCountOutputTypeSelect> = z.object({
  Department: z.boolean().optional(),
  IntentTrack: z.boolean().optional(),
  PatientVisit: z.boolean().optional(),
  Permission: z.boolean().optional(),
  Product: z.boolean().optional(),
  ProductIntent: z.boolean().optional(),
  Role: z.boolean().optional(),
  User: z.boolean().optional(),
  Vendor: z.boolean().optional(),
}).strict();

export const HospitalSelectSchema: z.ZodType<Prisma.HospitalSelect> = z.object({
  id: z.boolean().optional(),
  hospitalName: z.boolean().optional(),
  phoneNumber: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  Department: z.union([z.boolean(),z.lazy(() => DepartmentFindManyArgsSchema)]).optional(),
  IntentTrack: z.union([z.boolean(),z.lazy(() => IntentTrackFindManyArgsSchema)]).optional(),
  PatientVisit: z.union([z.boolean(),z.lazy(() => PatientVisitFindManyArgsSchema)]).optional(),
  Permission: z.union([z.boolean(),z.lazy(() => PermissionFindManyArgsSchema)]).optional(),
  Product: z.union([z.boolean(),z.lazy(() => ProductFindManyArgsSchema)]).optional(),
  ProductIntent: z.union([z.boolean(),z.lazy(() => ProductIntentFindManyArgsSchema)]).optional(),
  Role: z.union([z.boolean(),z.lazy(() => RoleFindManyArgsSchema)]).optional(),
  User: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  Vendor: z.union([z.boolean(),z.lazy(() => VendorFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => HospitalCountOutputTypeArgsSchema)]).optional(),
}).strict()

// DEPARTMENT
//------------------------------------------------------

export const DepartmentIncludeSchema: z.ZodType<Prisma.DepartmentInclude> = z.object({
  Hospital: z.union([z.boolean(),z.lazy(() => HospitalArgsSchema)]).optional(),
  Role: z.union([z.boolean(),z.lazy(() => RoleArgsSchema)]).optional(),
  PatientVisit: z.union([z.boolean(),z.lazy(() => PatientVisitFindManyArgsSchema)]).optional(),
  ProductDepartment: z.union([z.boolean(),z.lazy(() => ProductDepartmentFindManyArgsSchema)]).optional(),
  User: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DepartmentCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const DepartmentArgsSchema: z.ZodType<Prisma.DepartmentDefaultArgs> = z.object({
  select: z.lazy(() => DepartmentSelectSchema).optional(),
  include: z.lazy(() => DepartmentIncludeSchema).optional(),
}).strict();

export const DepartmentCountOutputTypeArgsSchema: z.ZodType<Prisma.DepartmentCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => DepartmentCountOutputTypeSelectSchema).nullish(),
}).strict();

export const DepartmentCountOutputTypeSelectSchema: z.ZodType<Prisma.DepartmentCountOutputTypeSelect> = z.object({
  PatientVisit: z.boolean().optional(),
  ProductDepartment: z.boolean().optional(),
  User: z.boolean().optional(),
}).strict();

export const DepartmentSelectSchema: z.ZodType<Prisma.DepartmentSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  hospitalId: z.boolean().optional(),
  roleId: z.boolean().optional(),
  updatedBy: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  Hospital: z.union([z.boolean(),z.lazy(() => HospitalArgsSchema)]).optional(),
  Role: z.union([z.boolean(),z.lazy(() => RoleArgsSchema)]).optional(),
  PatientVisit: z.union([z.boolean(),z.lazy(() => PatientVisitFindManyArgsSchema)]).optional(),
  ProductDepartment: z.union([z.boolean(),z.lazy(() => ProductDepartmentFindManyArgsSchema)]).optional(),
  User: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DepartmentCountOutputTypeArgsSchema)]).optional(),
}).strict()

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  Assessment: z.union([z.boolean(),z.lazy(() => AssessmentFindManyArgsSchema)]).optional(),
  PatientVisit: z.union([z.boolean(),z.lazy(() => PatientVisitFindManyArgsSchema)]).optional(),
  Department: z.union([z.boolean(),z.lazy(() => DepartmentArgsSchema)]).optional(),
  Hospital: z.union([z.boolean(),z.lazy(() => HospitalArgsSchema)]).optional(),
  UserLogin: z.union([z.boolean(),z.lazy(() => UserLoginArgsSchema)]).optional(),
  UserRole: z.union([z.boolean(),z.lazy(() => UserRoleFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  Assessment: z.boolean().optional(),
  PatientVisit: z.boolean().optional(),
  UserRole: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  phoneNumber: z.boolean().optional(),
  hospitalId: z.boolean().optional(),
  department: z.boolean().optional(),
  isActive: z.boolean().optional(),
  updatedBy: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  Assessment: z.union([z.boolean(),z.lazy(() => AssessmentFindManyArgsSchema)]).optional(),
  PatientVisit: z.union([z.boolean(),z.lazy(() => PatientVisitFindManyArgsSchema)]).optional(),
  Department: z.union([z.boolean(),z.lazy(() => DepartmentArgsSchema)]).optional(),
  Hospital: z.union([z.boolean(),z.lazy(() => HospitalArgsSchema)]).optional(),
  UserLogin: z.union([z.boolean(),z.lazy(() => UserLoginArgsSchema)]).optional(),
  UserRole: z.union([z.boolean(),z.lazy(() => UserRoleFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// USER LOGIN
//------------------------------------------------------

export const UserLoginIncludeSchema: z.ZodType<Prisma.UserLoginInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const UserLoginArgsSchema: z.ZodType<Prisma.UserLoginDefaultArgs> = z.object({
  select: z.lazy(() => UserLoginSelectSchema).optional(),
  include: z.lazy(() => UserLoginIncludeSchema).optional(),
}).strict();

export const UserLoginSelectSchema: z.ZodType<Prisma.UserLoginSelect> = z.object({
  userId: z.boolean().optional(),
  password: z.boolean().optional(),
  updatedBy: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// ROLE
//------------------------------------------------------

export const RoleIncludeSchema: z.ZodType<Prisma.RoleInclude> = z.object({
  Department: z.union([z.boolean(),z.lazy(() => DepartmentFindManyArgsSchema)]).optional(),
  Hospital: z.union([z.boolean(),z.lazy(() => HospitalArgsSchema)]).optional(),
  permissions: z.union([z.boolean(),z.lazy(() => RolePermissionFindManyArgsSchema)]).optional(),
  roleUsers: z.union([z.boolean(),z.lazy(() => UserRoleFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RoleCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const RoleArgsSchema: z.ZodType<Prisma.RoleDefaultArgs> = z.object({
  select: z.lazy(() => RoleSelectSchema).optional(),
  include: z.lazy(() => RoleIncludeSchema).optional(),
}).strict();

export const RoleCountOutputTypeArgsSchema: z.ZodType<Prisma.RoleCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => RoleCountOutputTypeSelectSchema).nullish(),
}).strict();

export const RoleCountOutputTypeSelectSchema: z.ZodType<Prisma.RoleCountOutputTypeSelect> = z.object({
  Department: z.boolean().optional(),
  permissions: z.boolean().optional(),
  roleUsers: z.boolean().optional(),
}).strict();

export const RoleSelectSchema: z.ZodType<Prisma.RoleSelect> = z.object({
  id: z.boolean().optional(),
  roleName: z.boolean().optional(),
  description: z.boolean().optional(),
  hospitalId: z.boolean().optional(),
  isSuperAdmin: z.boolean().optional(),
  updatedBy: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  Department: z.union([z.boolean(),z.lazy(() => DepartmentFindManyArgsSchema)]).optional(),
  Hospital: z.union([z.boolean(),z.lazy(() => HospitalArgsSchema)]).optional(),
  permissions: z.union([z.boolean(),z.lazy(() => RolePermissionFindManyArgsSchema)]).optional(),
  roleUsers: z.union([z.boolean(),z.lazy(() => UserRoleFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RoleCountOutputTypeArgsSchema)]).optional(),
}).strict()

// USER ROLE
//------------------------------------------------------

export const UserRoleIncludeSchema: z.ZodType<Prisma.UserRoleInclude> = z.object({
  role: z.union([z.boolean(),z.lazy(() => RoleArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const UserRoleArgsSchema: z.ZodType<Prisma.UserRoleDefaultArgs> = z.object({
  select: z.lazy(() => UserRoleSelectSchema).optional(),
  include: z.lazy(() => UserRoleIncludeSchema).optional(),
}).strict();

export const UserRoleSelectSchema: z.ZodType<Prisma.UserRoleSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  roleId: z.boolean().optional(),
  updatedBy: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  role: z.union([z.boolean(),z.lazy(() => RoleArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// PERMISSION
//------------------------------------------------------

export const PermissionIncludeSchema: z.ZodType<Prisma.PermissionInclude> = z.object({
  Hospital: z.union([z.boolean(),z.lazy(() => HospitalArgsSchema)]).optional(),
  rolePermissions: z.union([z.boolean(),z.lazy(() => RolePermissionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PermissionCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const PermissionArgsSchema: z.ZodType<Prisma.PermissionDefaultArgs> = z.object({
  select: z.lazy(() => PermissionSelectSchema).optional(),
  include: z.lazy(() => PermissionIncludeSchema).optional(),
}).strict();

export const PermissionCountOutputTypeArgsSchema: z.ZodType<Prisma.PermissionCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => PermissionCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PermissionCountOutputTypeSelectSchema: z.ZodType<Prisma.PermissionCountOutputTypeSelect> = z.object({
  rolePermissions: z.boolean().optional(),
}).strict();

export const PermissionSelectSchema: z.ZodType<Prisma.PermissionSelect> = z.object({
  id: z.boolean().optional(),
  permissionName: z.boolean().optional(),
  description: z.boolean().optional(),
  hospitalId: z.boolean().optional(),
  updatedBy: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  Hospital: z.union([z.boolean(),z.lazy(() => HospitalArgsSchema)]).optional(),
  rolePermissions: z.union([z.boolean(),z.lazy(() => RolePermissionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PermissionCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ROLE PERMISSION
//------------------------------------------------------

export const RolePermissionIncludeSchema: z.ZodType<Prisma.RolePermissionInclude> = z.object({
  permission: z.union([z.boolean(),z.lazy(() => PermissionArgsSchema)]).optional(),
  role: z.union([z.boolean(),z.lazy(() => RoleArgsSchema)]).optional(),
}).strict()

export const RolePermissionArgsSchema: z.ZodType<Prisma.RolePermissionDefaultArgs> = z.object({
  select: z.lazy(() => RolePermissionSelectSchema).optional(),
  include: z.lazy(() => RolePermissionIncludeSchema).optional(),
}).strict();

export const RolePermissionSelectSchema: z.ZodType<Prisma.RolePermissionSelect> = z.object({
  id: z.boolean().optional(),
  roleId: z.boolean().optional(),
  permissionId: z.boolean().optional(),
  updatedBy: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  permission: z.union([z.boolean(),z.lazy(() => PermissionArgsSchema)]).optional(),
  role: z.union([z.boolean(),z.lazy(() => RoleArgsSchema)]).optional(),
}).strict()

// VENDOR
//------------------------------------------------------

export const VendorIncludeSchema: z.ZodType<Prisma.VendorInclude> = z.object({
  Hospital: z.union([z.boolean(),z.lazy(() => HospitalArgsSchema)]).optional(),
}).strict()

export const VendorArgsSchema: z.ZodType<Prisma.VendorDefaultArgs> = z.object({
  select: z.lazy(() => VendorSelectSchema).optional(),
  include: z.lazy(() => VendorIncludeSchema).optional(),
}).strict();

export const VendorSelectSchema: z.ZodType<Prisma.VendorSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  phoneNumber: z.boolean().optional(),
  email: z.boolean().optional(),
  address: z.boolean().optional(),
  gstNumber: z.boolean().optional(),
  branchName: z.boolean().optional(),
  hospitalId: z.boolean().optional(),
  updatedBy: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  Hospital: z.union([z.boolean(),z.lazy(() => HospitalArgsSchema)]).optional(),
}).strict()

// PRODUCT
//------------------------------------------------------

export const ProductIncludeSchema: z.ZodType<Prisma.ProductInclude> = z.object({
  Hospital: z.union([z.boolean(),z.lazy(() => HospitalArgsSchema)]).optional(),
  ProductDepartment: z.union([z.boolean(),z.lazy(() => ProductDepartmentFindManyArgsSchema)]).optional(),
  ProductIntent: z.union([z.boolean(),z.lazy(() => ProductIntentFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProductCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ProductArgsSchema: z.ZodType<Prisma.ProductDefaultArgs> = z.object({
  select: z.lazy(() => ProductSelectSchema).optional(),
  include: z.lazy(() => ProductIncludeSchema).optional(),
}).strict();

export const ProductCountOutputTypeArgsSchema: z.ZodType<Prisma.ProductCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ProductCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ProductCountOutputTypeSelectSchema: z.ZodType<Prisma.ProductCountOutputTypeSelect> = z.object({
  ProductDepartment: z.boolean().optional(),
  ProductIntent: z.boolean().optional(),
}).strict();

export const ProductSelectSchema: z.ZodType<Prisma.ProductSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  sku: z.boolean().optional(),
  hsnCode: z.boolean().optional(),
  genericName: z.boolean().optional(),
  brandName: z.boolean().optional(),
  manufacturer: z.boolean().optional(),
  dosageForm: z.boolean().optional(),
  strength: z.boolean().optional(),
  purchaseRate: z.boolean().optional(),
  saleRate: z.boolean().optional(),
  mrp: z.boolean().optional(),
  maxDiscount: z.boolean().optional(),
  hospitalId: z.boolean().optional(),
  updatedBy: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  Hospital: z.union([z.boolean(),z.lazy(() => HospitalArgsSchema)]).optional(),
  ProductDepartment: z.union([z.boolean(),z.lazy(() => ProductDepartmentFindManyArgsSchema)]).optional(),
  ProductIntent: z.union([z.boolean(),z.lazy(() => ProductIntentFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProductCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PRODUCT DEPARTMENT
//------------------------------------------------------

export const ProductDepartmentIncludeSchema: z.ZodType<Prisma.ProductDepartmentInclude> = z.object({
  Department: z.union([z.boolean(),z.lazy(() => DepartmentArgsSchema)]).optional(),
  Product: z.union([z.boolean(),z.lazy(() => ProductArgsSchema)]).optional(),
}).strict()

export const ProductDepartmentArgsSchema: z.ZodType<Prisma.ProductDepartmentDefaultArgs> = z.object({
  select: z.lazy(() => ProductDepartmentSelectSchema).optional(),
  include: z.lazy(() => ProductDepartmentIncludeSchema).optional(),
}).strict();

export const ProductDepartmentSelectSchema: z.ZodType<Prisma.ProductDepartmentSelect> = z.object({
  id: z.boolean().optional(),
  productId: z.boolean().optional(),
  departmentId: z.boolean().optional(),
  updatedBy: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  Department: z.union([z.boolean(),z.lazy(() => DepartmentArgsSchema)]).optional(),
  Product: z.union([z.boolean(),z.lazy(() => ProductArgsSchema)]).optional(),
}).strict()

// INTENT TRACK
//------------------------------------------------------

export const IntentTrackIncludeSchema: z.ZodType<Prisma.IntentTrackInclude> = z.object({
  Hospital: z.union([z.boolean(),z.lazy(() => HospitalArgsSchema)]).optional(),
  IntentStatus: z.union([z.boolean(),z.lazy(() => IntentStatusArgsSchema)]).optional(),
  ProductIntent: z.union([z.boolean(),z.lazy(() => ProductIntentFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => IntentTrackCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const IntentTrackArgsSchema: z.ZodType<Prisma.IntentTrackDefaultArgs> = z.object({
  select: z.lazy(() => IntentTrackSelectSchema).optional(),
  include: z.lazy(() => IntentTrackIncludeSchema).optional(),
}).strict();

export const IntentTrackCountOutputTypeArgsSchema: z.ZodType<Prisma.IntentTrackCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => IntentTrackCountOutputTypeSelectSchema).nullish(),
}).strict();

export const IntentTrackCountOutputTypeSelectSchema: z.ZodType<Prisma.IntentTrackCountOutputTypeSelect> = z.object({
  ProductIntent: z.boolean().optional(),
}).strict();

export const IntentTrackSelectSchema: z.ZodType<Prisma.IntentTrackSelect> = z.object({
  id: z.boolean().optional(),
  hospitalId: z.boolean().optional(),
  statusId: z.boolean().optional(),
  color: z.boolean().optional(),
  updatedBy: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  Hospital: z.union([z.boolean(),z.lazy(() => HospitalArgsSchema)]).optional(),
  IntentStatus: z.union([z.boolean(),z.lazy(() => IntentStatusArgsSchema)]).optional(),
  ProductIntent: z.union([z.boolean(),z.lazy(() => ProductIntentFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => IntentTrackCountOutputTypeArgsSchema)]).optional(),
}).strict()

// INTENT STATUS
//------------------------------------------------------

export const IntentStatusIncludeSchema: z.ZodType<Prisma.IntentStatusInclude> = z.object({
  tracks: z.union([z.boolean(),z.lazy(() => IntentTrackFindManyArgsSchema)]).optional(),
  ProductIntent: z.union([z.boolean(),z.lazy(() => ProductIntentFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => IntentStatusCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const IntentStatusArgsSchema: z.ZodType<Prisma.IntentStatusDefaultArgs> = z.object({
  select: z.lazy(() => IntentStatusSelectSchema).optional(),
  include: z.lazy(() => IntentStatusIncludeSchema).optional(),
}).strict();

export const IntentStatusCountOutputTypeArgsSchema: z.ZodType<Prisma.IntentStatusCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => IntentStatusCountOutputTypeSelectSchema).nullish(),
}).strict();

export const IntentStatusCountOutputTypeSelectSchema: z.ZodType<Prisma.IntentStatusCountOutputTypeSelect> = z.object({
  tracks: z.boolean().optional(),
  ProductIntent: z.boolean().optional(),
}).strict();

export const IntentStatusSelectSchema: z.ZodType<Prisma.IntentStatusSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  updatedBy: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  tracks: z.union([z.boolean(),z.lazy(() => IntentTrackFindManyArgsSchema)]).optional(),
  ProductIntent: z.union([z.boolean(),z.lazy(() => ProductIntentFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => IntentStatusCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PRODUCT INTENT
//------------------------------------------------------

export const ProductIntentIncludeSchema: z.ZodType<Prisma.ProductIntentInclude> = z.object({
  Hospital: z.union([z.boolean(),z.lazy(() => HospitalArgsSchema)]).optional(),
  Intent: z.union([z.boolean(),z.lazy(() => IntentStatusArgsSchema)]).optional(),
  Product: z.union([z.boolean(),z.lazy(() => ProductArgsSchema)]).optional(),
  Track: z.union([z.boolean(),z.lazy(() => IntentTrackArgsSchema)]).optional(),
}).strict()

export const ProductIntentArgsSchema: z.ZodType<Prisma.ProductIntentDefaultArgs> = z.object({
  select: z.lazy(() => ProductIntentSelectSchema).optional(),
  include: z.lazy(() => ProductIntentIncludeSchema).optional(),
}).strict();

export const ProductIntentSelectSchema: z.ZodType<Prisma.ProductIntentSelect> = z.object({
  id: z.boolean().optional(),
  productId: z.boolean().optional(),
  intentId: z.boolean().optional(),
  trackId: z.boolean().optional(),
  hospitalId: z.boolean().optional(),
  updatedBy: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  Hospital: z.union([z.boolean(),z.lazy(() => HospitalArgsSchema)]).optional(),
  Intent: z.union([z.boolean(),z.lazy(() => IntentStatusArgsSchema)]).optional(),
  Product: z.union([z.boolean(),z.lazy(() => ProductArgsSchema)]).optional(),
  Track: z.union([z.boolean(),z.lazy(() => IntentTrackArgsSchema)]).optional(),
}).strict()

// PATIENT
//------------------------------------------------------

export const PatientIncludeSchema: z.ZodType<Prisma.PatientInclude> = z.object({
  Assessment: z.union([z.boolean(),z.lazy(() => AssessmentFindManyArgsSchema)]).optional(),
  PatientVisit: z.union([z.boolean(),z.lazy(() => PatientVisitFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PatientCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const PatientArgsSchema: z.ZodType<Prisma.PatientDefaultArgs> = z.object({
  select: z.lazy(() => PatientSelectSchema).optional(),
  include: z.lazy(() => PatientIncludeSchema).optional(),
}).strict();

export const PatientCountOutputTypeArgsSchema: z.ZodType<Prisma.PatientCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => PatientCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PatientCountOutputTypeSelectSchema: z.ZodType<Prisma.PatientCountOutputTypeSelect> = z.object({
  Assessment: z.boolean().optional(),
  PatientVisit: z.boolean().optional(),
}).strict();

export const PatientSelectSchema: z.ZodType<Prisma.PatientSelect> = z.object({
  uhid: z.boolean().optional(),
  name: z.boolean().optional(),
  gender: z.boolean().optional(),
  mobile: z.boolean().optional(),
  hospitalId: z.boolean().optional(),
  dob: z.boolean().optional(),
  bornYear: z.boolean().optional(),
  aadharNumber: z.boolean().optional(),
  aadharName: z.boolean().optional(),
  bloodGroup: z.boolean().optional(),
  address: z.boolean().optional(),
  city: z.boolean().optional(),
  pincode: z.boolean().optional(),
  updatedBy: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  fatherName: z.boolean().optional(),
  Assessment: z.union([z.boolean(),z.lazy(() => AssessmentFindManyArgsSchema)]).optional(),
  PatientVisit: z.union([z.boolean(),z.lazy(() => PatientVisitFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PatientCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PATIENT VISIT
//------------------------------------------------------

export const PatientVisitIncludeSchema: z.ZodType<Prisma.PatientVisitInclude> = z.object({
  Assessment: z.union([z.boolean(),z.lazy(() => AssessmentArgsSchema)]).optional(),
  Department: z.union([z.boolean(),z.lazy(() => DepartmentArgsSchema)]).optional(),
  Doctor: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  Hospital: z.union([z.boolean(),z.lazy(() => HospitalArgsSchema)]).optional(),
  Patient: z.union([z.boolean(),z.lazy(() => PatientArgsSchema)]).optional(),
}).strict()

export const PatientVisitArgsSchema: z.ZodType<Prisma.PatientVisitDefaultArgs> = z.object({
  select: z.lazy(() => PatientVisitSelectSchema).optional(),
  include: z.lazy(() => PatientVisitIncludeSchema).optional(),
}).strict();

export const PatientVisitSelectSchema: z.ZodType<Prisma.PatientVisitSelect> = z.object({
  id: z.boolean().optional(),
  uhid: z.boolean().optional(),
  hospitalId: z.boolean().optional(),
  departmentId: z.boolean().optional(),
  doctorId: z.boolean().optional(),
  checkInTime: z.boolean().optional(),
  checkOutTime: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  Assessment: z.union([z.boolean(),z.lazy(() => AssessmentArgsSchema)]).optional(),
  Department: z.union([z.boolean(),z.lazy(() => DepartmentArgsSchema)]).optional(),
  Doctor: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  Hospital: z.union([z.boolean(),z.lazy(() => HospitalArgsSchema)]).optional(),
  Patient: z.union([z.boolean(),z.lazy(() => PatientArgsSchema)]).optional(),
}).strict()

// ASSESSMENT
//------------------------------------------------------

export const AssessmentIncludeSchema: z.ZodType<Prisma.AssessmentInclude> = z.object({
  Doctor: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  PatientVisit: z.union([z.boolean(),z.lazy(() => PatientVisitArgsSchema)]).optional(),
  Patient: z.union([z.boolean(),z.lazy(() => PatientArgsSchema)]).optional(),
}).strict()

export const AssessmentArgsSchema: z.ZodType<Prisma.AssessmentDefaultArgs> = z.object({
  select: z.lazy(() => AssessmentSelectSchema).optional(),
  include: z.lazy(() => AssessmentIncludeSchema).optional(),
}).strict();

export const AssessmentSelectSchema: z.ZodType<Prisma.AssessmentSelect> = z.object({
  id: z.boolean().optional(),
  uhid: z.boolean().optional(),
  doctorId: z.boolean().optional(),
  patientVisitId: z.boolean().optional(),
  complaint: z.boolean().optional(),
  currentMedication: z.boolean().optional(),
  pastMedicalHistory: z.boolean().optional(),
  examination: z.boolean().optional(),
  investigation: z.boolean().optional(),
  procedureDone: z.boolean().optional(),
  diagnosis: z.boolean().optional(),
  treatmentGiven: z.boolean().optional(),
  followUp: z.boolean().optional(),
  followupInstruction: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  Doctor: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  PatientVisit: z.union([z.boolean(),z.lazy(() => PatientVisitArgsSchema)]).optional(),
  Patient: z.union([z.boolean(),z.lazy(() => PatientArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const HospitalWhereInputSchema: z.ZodType<Prisma.HospitalWhereInput> = z.object({
  AND: z.union([ z.lazy(() => HospitalWhereInputSchema),z.lazy(() => HospitalWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => HospitalWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => HospitalWhereInputSchema),z.lazy(() => HospitalWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  hospitalName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Department: z.lazy(() => DepartmentListRelationFilterSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackListRelationFilterSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitListRelationFilterSchema).optional(),
  Permission: z.lazy(() => PermissionListRelationFilterSchema).optional(),
  Product: z.lazy(() => ProductListRelationFilterSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentListRelationFilterSchema).optional(),
  Role: z.lazy(() => RoleListRelationFilterSchema).optional(),
  User: z.lazy(() => UserListRelationFilterSchema).optional(),
  Vendor: z.lazy(() => VendorListRelationFilterSchema).optional()
}).strict();

export const HospitalOrderByWithRelationInputSchema: z.ZodType<Prisma.HospitalOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hospitalName: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  Department: z.lazy(() => DepartmentOrderByRelationAggregateInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackOrderByRelationAggregateInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitOrderByRelationAggregateInputSchema).optional(),
  Permission: z.lazy(() => PermissionOrderByRelationAggregateInputSchema).optional(),
  Product: z.lazy(() => ProductOrderByRelationAggregateInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentOrderByRelationAggregateInputSchema).optional(),
  Role: z.lazy(() => RoleOrderByRelationAggregateInputSchema).optional(),
  User: z.lazy(() => UserOrderByRelationAggregateInputSchema).optional(),
  Vendor: z.lazy(() => VendorOrderByRelationAggregateInputSchema).optional()
}).strict();

export const HospitalWhereUniqueInputSchema: z.ZodType<Prisma.HospitalWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => HospitalWhereInputSchema),z.lazy(() => HospitalWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => HospitalWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => HospitalWhereInputSchema),z.lazy(() => HospitalWhereInputSchema).array() ]).optional(),
  hospitalName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Department: z.lazy(() => DepartmentListRelationFilterSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackListRelationFilterSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitListRelationFilterSchema).optional(),
  Permission: z.lazy(() => PermissionListRelationFilterSchema).optional(),
  Product: z.lazy(() => ProductListRelationFilterSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentListRelationFilterSchema).optional(),
  Role: z.lazy(() => RoleListRelationFilterSchema).optional(),
  User: z.lazy(() => UserListRelationFilterSchema).optional(),
  Vendor: z.lazy(() => VendorListRelationFilterSchema).optional()
}).strict());

export const HospitalOrderByWithAggregationInputSchema: z.ZodType<Prisma.HospitalOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hospitalName: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => HospitalCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => HospitalAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => HospitalMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => HospitalMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => HospitalSumOrderByAggregateInputSchema).optional()
}).strict();

export const HospitalScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.HospitalScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => HospitalScalarWhereWithAggregatesInputSchema),z.lazy(() => HospitalScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => HospitalScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => HospitalScalarWhereWithAggregatesInputSchema),z.lazy(() => HospitalScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  hospitalName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const DepartmentWhereInputSchema: z.ZodType<Prisma.DepartmentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DepartmentWhereInputSchema),z.lazy(() => DepartmentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DepartmentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DepartmentWhereInputSchema),z.lazy(() => DepartmentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  roleId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Hospital: z.union([ z.lazy(() => HospitalRelationFilterSchema),z.lazy(() => HospitalWhereInputSchema) ]).optional(),
  Role: z.union([ z.lazy(() => RoleRelationFilterSchema),z.lazy(() => RoleWhereInputSchema) ]).optional(),
  PatientVisit: z.lazy(() => PatientVisitListRelationFilterSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentListRelationFilterSchema).optional(),
  User: z.lazy(() => UserListRelationFilterSchema).optional()
}).strict();

export const DepartmentOrderByWithRelationInputSchema: z.ZodType<Prisma.DepartmentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  Hospital: z.lazy(() => HospitalOrderByWithRelationInputSchema).optional(),
  Role: z.lazy(() => RoleOrderByWithRelationInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitOrderByRelationAggregateInputSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentOrderByRelationAggregateInputSchema).optional(),
  User: z.lazy(() => UserOrderByRelationAggregateInputSchema).optional()
}).strict();

export const DepartmentWhereUniqueInputSchema: z.ZodType<Prisma.DepartmentWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => DepartmentWhereInputSchema),z.lazy(() => DepartmentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DepartmentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DepartmentWhereInputSchema),z.lazy(() => DepartmentWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  roleId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Hospital: z.union([ z.lazy(() => HospitalRelationFilterSchema),z.lazy(() => HospitalWhereInputSchema) ]).optional(),
  Role: z.union([ z.lazy(() => RoleRelationFilterSchema),z.lazy(() => RoleWhereInputSchema) ]).optional(),
  PatientVisit: z.lazy(() => PatientVisitListRelationFilterSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentListRelationFilterSchema).optional(),
  User: z.lazy(() => UserListRelationFilterSchema).optional()
}).strict());

export const DepartmentOrderByWithAggregationInputSchema: z.ZodType<Prisma.DepartmentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => DepartmentCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => DepartmentAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DepartmentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DepartmentMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => DepartmentSumOrderByAggregateInputSchema).optional()
}).strict();

export const DepartmentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DepartmentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => DepartmentScalarWhereWithAggregatesInputSchema),z.lazy(() => DepartmentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DepartmentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DepartmentScalarWhereWithAggregatesInputSchema),z.lazy(() => DepartmentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  roleId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  department: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  isActive: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Assessment: z.lazy(() => AssessmentListRelationFilterSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitListRelationFilterSchema).optional(),
  Department: z.union([ z.lazy(() => DepartmentRelationFilterSchema),z.lazy(() => DepartmentWhereInputSchema) ]).optional(),
  Hospital: z.union([ z.lazy(() => HospitalRelationFilterSchema),z.lazy(() => HospitalWhereInputSchema) ]).optional(),
  UserLogin: z.union([ z.lazy(() => UserLoginNullableRelationFilterSchema),z.lazy(() => UserLoginWhereInputSchema) ]).optional().nullable(),
  UserRole: z.lazy(() => UserRoleListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  department: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  Assessment: z.lazy(() => AssessmentOrderByRelationAggregateInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitOrderByRelationAggregateInputSchema).optional(),
  Department: z.lazy(() => DepartmentOrderByWithRelationInputSchema).optional(),
  Hospital: z.lazy(() => HospitalOrderByWithRelationInputSchema).optional(),
  UserLogin: z.lazy(() => UserLoginOrderByWithRelationInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    email_hospitalId: z.lazy(() => UserEmailHospitalIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    email_hospitalId: z.lazy(() => UserEmailHospitalIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().optional(),
  email_hospitalId: z.lazy(() => UserEmailHospitalIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  department: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  isActive: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Assessment: z.lazy(() => AssessmentListRelationFilterSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitListRelationFilterSchema).optional(),
  Department: z.union([ z.lazy(() => DepartmentRelationFilterSchema),z.lazy(() => DepartmentWhereInputSchema) ]).optional(),
  Hospital: z.union([ z.lazy(() => HospitalRelationFilterSchema),z.lazy(() => HospitalWhereInputSchema) ]).optional(),
  UserLogin: z.union([ z.lazy(() => UserLoginNullableRelationFilterSchema),z.lazy(() => UserLoginWhereInputSchema) ]).optional().nullable(),
  UserRole: z.lazy(() => UserRoleListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  department: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserSumOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  department: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  isActive: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserLoginWhereInputSchema: z.ZodType<Prisma.UserLoginWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserLoginWhereInputSchema),z.lazy(() => UserLoginWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserLoginWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserLoginWhereInputSchema),z.lazy(() => UserLoginWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const UserLoginOrderByWithRelationInputSchema: z.ZodType<Prisma.UserLoginOrderByWithRelationInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const UserLoginWhereUniqueInputSchema: z.ZodType<Prisma.UserLoginWhereUniqueInput> = z.object({
  userId: z.string()
})
.and(z.object({
  userId: z.string().optional(),
  AND: z.union([ z.lazy(() => UserLoginWhereInputSchema),z.lazy(() => UserLoginWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserLoginWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserLoginWhereInputSchema),z.lazy(() => UserLoginWhereInputSchema).array() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const UserLoginOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserLoginOrderByWithAggregationInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserLoginCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserLoginMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserLoginMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserLoginScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserLoginScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserLoginScalarWhereWithAggregatesInputSchema),z.lazy(() => UserLoginScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserLoginScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserLoginScalarWhereWithAggregatesInputSchema),z.lazy(() => UserLoginScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const RoleWhereInputSchema: z.ZodType<Prisma.RoleWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RoleWhereInputSchema),z.lazy(() => RoleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoleWhereInputSchema),z.lazy(() => RoleWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  roleName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  isSuperAdmin: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Department: z.lazy(() => DepartmentListRelationFilterSchema).optional(),
  Hospital: z.union([ z.lazy(() => HospitalRelationFilterSchema),z.lazy(() => HospitalWhereInputSchema) ]).optional(),
  permissions: z.lazy(() => RolePermissionListRelationFilterSchema).optional(),
  roleUsers: z.lazy(() => UserRoleListRelationFilterSchema).optional()
}).strict();

export const RoleOrderByWithRelationInputSchema: z.ZodType<Prisma.RoleOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roleName: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  isSuperAdmin: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  Department: z.lazy(() => DepartmentOrderByRelationAggregateInputSchema).optional(),
  Hospital: z.lazy(() => HospitalOrderByWithRelationInputSchema).optional(),
  permissions: z.lazy(() => RolePermissionOrderByRelationAggregateInputSchema).optional(),
  roleUsers: z.lazy(() => UserRoleOrderByRelationAggregateInputSchema).optional()
}).strict();

export const RoleWhereUniqueInputSchema: z.ZodType<Prisma.RoleWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    roleName_hospitalId: z.lazy(() => RoleRoleNameHospitalIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    roleName_hospitalId: z.lazy(() => RoleRoleNameHospitalIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  roleName_hospitalId: z.lazy(() => RoleRoleNameHospitalIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => RoleWhereInputSchema),z.lazy(() => RoleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoleWhereInputSchema),z.lazy(() => RoleWhereInputSchema).array() ]).optional(),
  roleName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  isSuperAdmin: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Department: z.lazy(() => DepartmentListRelationFilterSchema).optional(),
  Hospital: z.union([ z.lazy(() => HospitalRelationFilterSchema),z.lazy(() => HospitalWhereInputSchema) ]).optional(),
  permissions: z.lazy(() => RolePermissionListRelationFilterSchema).optional(),
  roleUsers: z.lazy(() => UserRoleListRelationFilterSchema).optional()
}).strict());

export const RoleOrderByWithAggregationInputSchema: z.ZodType<Prisma.RoleOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roleName: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  isSuperAdmin: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => RoleCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => RoleAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => RoleMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => RoleMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => RoleSumOrderByAggregateInputSchema).optional()
}).strict();

export const RoleScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.RoleScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => RoleScalarWhereWithAggregatesInputSchema),z.lazy(() => RoleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoleScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoleScalarWhereWithAggregatesInputSchema),z.lazy(() => RoleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  roleName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  hospitalId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  isSuperAdmin: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema),z.boolean() ]).optional().nullable(),
  updatedBy: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserRoleWhereInputSchema: z.ZodType<Prisma.UserRoleWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserRoleWhereInputSchema),z.lazy(() => UserRoleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserRoleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserRoleWhereInputSchema),z.lazy(() => UserRoleWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  roleId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  role: z.union([ z.lazy(() => RoleRelationFilterSchema),z.lazy(() => RoleWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const UserRoleOrderByWithRelationInputSchema: z.ZodType<Prisma.UserRoleOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => RoleOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const UserRoleWhereUniqueInputSchema: z.ZodType<Prisma.UserRoleWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    userId_roleId: z.lazy(() => UserRoleUserIdRoleIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    userId_roleId: z.lazy(() => UserRoleUserIdRoleIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  userId_roleId: z.lazy(() => UserRoleUserIdRoleIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => UserRoleWhereInputSchema),z.lazy(() => UserRoleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserRoleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserRoleWhereInputSchema),z.lazy(() => UserRoleWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  roleId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  role: z.union([ z.lazy(() => RoleRelationFilterSchema),z.lazy(() => RoleWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const UserRoleOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserRoleOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserRoleCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserRoleAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserRoleMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserRoleMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserRoleSumOrderByAggregateInputSchema).optional()
}).strict();

export const UserRoleScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserRoleScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserRoleScalarWhereWithAggregatesInputSchema),z.lazy(() => UserRoleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserRoleScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserRoleScalarWhereWithAggregatesInputSchema),z.lazy(() => UserRoleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  roleId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PermissionWhereInputSchema: z.ZodType<Prisma.PermissionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PermissionWhereInputSchema),z.lazy(() => PermissionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PermissionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PermissionWhereInputSchema),z.lazy(() => PermissionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  permissionName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Hospital: z.union([ z.lazy(() => HospitalRelationFilterSchema),z.lazy(() => HospitalWhereInputSchema) ]).optional(),
  rolePermissions: z.lazy(() => RolePermissionListRelationFilterSchema).optional()
}).strict();

export const PermissionOrderByWithRelationInputSchema: z.ZodType<Prisma.PermissionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  permissionName: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  Hospital: z.lazy(() => HospitalOrderByWithRelationInputSchema).optional(),
  rolePermissions: z.lazy(() => RolePermissionOrderByRelationAggregateInputSchema).optional()
}).strict();

export const PermissionWhereUniqueInputSchema: z.ZodType<Prisma.PermissionWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    permissionName: z.string()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    permissionName: z.string(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  permissionName: z.string().optional(),
  AND: z.union([ z.lazy(() => PermissionWhereInputSchema),z.lazy(() => PermissionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PermissionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PermissionWhereInputSchema),z.lazy(() => PermissionWhereInputSchema).array() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Hospital: z.union([ z.lazy(() => HospitalRelationFilterSchema),z.lazy(() => HospitalWhereInputSchema) ]).optional(),
  rolePermissions: z.lazy(() => RolePermissionListRelationFilterSchema).optional()
}).strict());

export const PermissionOrderByWithAggregationInputSchema: z.ZodType<Prisma.PermissionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  permissionName: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PermissionCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PermissionAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PermissionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PermissionMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PermissionSumOrderByAggregateInputSchema).optional()
}).strict();

export const PermissionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PermissionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PermissionScalarWhereWithAggregatesInputSchema),z.lazy(() => PermissionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PermissionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PermissionScalarWhereWithAggregatesInputSchema),z.lazy(() => PermissionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  permissionName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  hospitalId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const RolePermissionWhereInputSchema: z.ZodType<Prisma.RolePermissionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RolePermissionWhereInputSchema),z.lazy(() => RolePermissionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RolePermissionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RolePermissionWhereInputSchema),z.lazy(() => RolePermissionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  roleId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  permissionId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  permission: z.union([ z.lazy(() => PermissionRelationFilterSchema),z.lazy(() => PermissionWhereInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleRelationFilterSchema),z.lazy(() => RoleWhereInputSchema) ]).optional(),
}).strict();

export const RolePermissionOrderByWithRelationInputSchema: z.ZodType<Prisma.RolePermissionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  permissionId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  permission: z.lazy(() => PermissionOrderByWithRelationInputSchema).optional(),
  role: z.lazy(() => RoleOrderByWithRelationInputSchema).optional()
}).strict();

export const RolePermissionWhereUniqueInputSchema: z.ZodType<Prisma.RolePermissionWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => RolePermissionWhereInputSchema),z.lazy(() => RolePermissionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RolePermissionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RolePermissionWhereInputSchema),z.lazy(() => RolePermissionWhereInputSchema).array() ]).optional(),
  roleId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  permissionId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  permission: z.union([ z.lazy(() => PermissionRelationFilterSchema),z.lazy(() => PermissionWhereInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleRelationFilterSchema),z.lazy(() => RoleWhereInputSchema) ]).optional(),
}).strict());

export const RolePermissionOrderByWithAggregationInputSchema: z.ZodType<Prisma.RolePermissionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  permissionId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => RolePermissionCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => RolePermissionAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => RolePermissionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => RolePermissionMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => RolePermissionSumOrderByAggregateInputSchema).optional()
}).strict();

export const RolePermissionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.RolePermissionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => RolePermissionScalarWhereWithAggregatesInputSchema),z.lazy(() => RolePermissionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => RolePermissionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RolePermissionScalarWhereWithAggregatesInputSchema),z.lazy(() => RolePermissionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  roleId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  permissionId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const VendorWhereInputSchema: z.ZodType<Prisma.VendorWhereInput> = z.object({
  AND: z.union([ z.lazy(() => VendorWhereInputSchema),z.lazy(() => VendorWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VendorWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VendorWhereInputSchema),z.lazy(() => VendorWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  gstNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  branchName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Hospital: z.union([ z.lazy(() => HospitalRelationFilterSchema),z.lazy(() => HospitalWhereInputSchema) ]).optional(),
}).strict();

export const VendorOrderByWithRelationInputSchema: z.ZodType<Prisma.VendorOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  gstNumber: z.lazy(() => SortOrderSchema).optional(),
  branchName: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  Hospital: z.lazy(() => HospitalOrderByWithRelationInputSchema).optional()
}).strict();

export const VendorWhereUniqueInputSchema: z.ZodType<Prisma.VendorWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => VendorWhereInputSchema),z.lazy(() => VendorWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VendorWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VendorWhereInputSchema),z.lazy(() => VendorWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  gstNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  branchName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Hospital: z.union([ z.lazy(() => HospitalRelationFilterSchema),z.lazy(() => HospitalWhereInputSchema) ]).optional(),
}).strict());

export const VendorOrderByWithAggregationInputSchema: z.ZodType<Prisma.VendorOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  gstNumber: z.lazy(() => SortOrderSchema).optional(),
  branchName: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => VendorCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => VendorAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => VendorMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => VendorMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => VendorSumOrderByAggregateInputSchema).optional()
}).strict();

export const VendorScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VendorScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => VendorScalarWhereWithAggregatesInputSchema),z.lazy(() => VendorScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => VendorScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VendorScalarWhereWithAggregatesInputSchema),z.lazy(() => VendorScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  gstNumber: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  branchName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ProductWhereInputSchema: z.ZodType<Prisma.ProductWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProductWhereInputSchema),z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductWhereInputSchema),z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sku: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  hsnCode: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  genericName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  brandName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  manufacturer: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  dosageForm: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  strength: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  purchaseRate: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  saleRate: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  mrp: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  maxDiscount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Hospital: z.union([ z.lazy(() => HospitalRelationFilterSchema),z.lazy(() => HospitalWhereInputSchema) ]).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentListRelationFilterSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentListRelationFilterSchema).optional()
}).strict();

export const ProductOrderByWithRelationInputSchema: z.ZodType<Prisma.ProductOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sku: z.lazy(() => SortOrderSchema).optional(),
  hsnCode: z.lazy(() => SortOrderSchema).optional(),
  genericName: z.lazy(() => SortOrderSchema).optional(),
  brandName: z.lazy(() => SortOrderSchema).optional(),
  manufacturer: z.lazy(() => SortOrderSchema).optional(),
  dosageForm: z.lazy(() => SortOrderSchema).optional(),
  strength: z.lazy(() => SortOrderSchema).optional(),
  purchaseRate: z.lazy(() => SortOrderSchema).optional(),
  saleRate: z.lazy(() => SortOrderSchema).optional(),
  mrp: z.lazy(() => SortOrderSchema).optional(),
  maxDiscount: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  Hospital: z.lazy(() => HospitalOrderByWithRelationInputSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentOrderByRelationAggregateInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ProductWhereUniqueInputSchema: z.ZodType<Prisma.ProductWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => ProductWhereInputSchema),z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductWhereInputSchema),z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sku: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  hsnCode: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  genericName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  brandName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  manufacturer: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  dosageForm: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  strength: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  purchaseRate: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  saleRate: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  mrp: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  maxDiscount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Hospital: z.union([ z.lazy(() => HospitalRelationFilterSchema),z.lazy(() => HospitalWhereInputSchema) ]).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentListRelationFilterSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentListRelationFilterSchema).optional()
}).strict());

export const ProductOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProductOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sku: z.lazy(() => SortOrderSchema).optional(),
  hsnCode: z.lazy(() => SortOrderSchema).optional(),
  genericName: z.lazy(() => SortOrderSchema).optional(),
  brandName: z.lazy(() => SortOrderSchema).optional(),
  manufacturer: z.lazy(() => SortOrderSchema).optional(),
  dosageForm: z.lazy(() => SortOrderSchema).optional(),
  strength: z.lazy(() => SortOrderSchema).optional(),
  purchaseRate: z.lazy(() => SortOrderSchema).optional(),
  saleRate: z.lazy(() => SortOrderSchema).optional(),
  mrp: z.lazy(() => SortOrderSchema).optional(),
  maxDiscount: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProductCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProductAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProductMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProductMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProductSumOrderByAggregateInputSchema).optional()
}).strict();

export const ProductScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProductScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProductScalarWhereWithAggregatesInputSchema),z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductScalarWhereWithAggregatesInputSchema),z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  sku: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  hsnCode: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  genericName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  brandName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  manufacturer: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  dosageForm: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  strength: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  purchaseRate: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  saleRate: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  mrp: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  maxDiscount: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ProductDepartmentWhereInputSchema: z.ZodType<Prisma.ProductDepartmentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProductDepartmentWhereInputSchema),z.lazy(() => ProductDepartmentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductDepartmentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductDepartmentWhereInputSchema),z.lazy(() => ProductDepartmentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  productId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  departmentId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Department: z.union([ z.lazy(() => DepartmentRelationFilterSchema),z.lazy(() => DepartmentWhereInputSchema) ]).optional(),
  Product: z.union([ z.lazy(() => ProductRelationFilterSchema),z.lazy(() => ProductWhereInputSchema) ]).optional(),
}).strict();

export const ProductDepartmentOrderByWithRelationInputSchema: z.ZodType<Prisma.ProductDepartmentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  departmentId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  Department: z.lazy(() => DepartmentOrderByWithRelationInputSchema).optional(),
  Product: z.lazy(() => ProductOrderByWithRelationInputSchema).optional()
}).strict();

export const ProductDepartmentWhereUniqueInputSchema: z.ZodType<Prisma.ProductDepartmentWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    productId_departmentId: z.lazy(() => ProductDepartmentProductIdDepartmentIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    productId_departmentId: z.lazy(() => ProductDepartmentProductIdDepartmentIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  productId_departmentId: z.lazy(() => ProductDepartmentProductIdDepartmentIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => ProductDepartmentWhereInputSchema),z.lazy(() => ProductDepartmentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductDepartmentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductDepartmentWhereInputSchema),z.lazy(() => ProductDepartmentWhereInputSchema).array() ]).optional(),
  productId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  departmentId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Department: z.union([ z.lazy(() => DepartmentRelationFilterSchema),z.lazy(() => DepartmentWhereInputSchema) ]).optional(),
  Product: z.union([ z.lazy(() => ProductRelationFilterSchema),z.lazy(() => ProductWhereInputSchema) ]).optional(),
}).strict());

export const ProductDepartmentOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProductDepartmentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  departmentId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProductDepartmentCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProductDepartmentAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProductDepartmentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProductDepartmentMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProductDepartmentSumOrderByAggregateInputSchema).optional()
}).strict();

export const ProductDepartmentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProductDepartmentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProductDepartmentScalarWhereWithAggregatesInputSchema),z.lazy(() => ProductDepartmentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductDepartmentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductDepartmentScalarWhereWithAggregatesInputSchema),z.lazy(() => ProductDepartmentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  productId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  departmentId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const IntentTrackWhereInputSchema: z.ZodType<Prisma.IntentTrackWhereInput> = z.object({
  AND: z.union([ z.lazy(() => IntentTrackWhereInputSchema),z.lazy(() => IntentTrackWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => IntentTrackWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => IntentTrackWhereInputSchema),z.lazy(() => IntentTrackWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  statusId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  color: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Hospital: z.union([ z.lazy(() => HospitalRelationFilterSchema),z.lazy(() => HospitalWhereInputSchema) ]).optional(),
  IntentStatus: z.union([ z.lazy(() => IntentStatusRelationFilterSchema),z.lazy(() => IntentStatusWhereInputSchema) ]).optional(),
  ProductIntent: z.lazy(() => ProductIntentListRelationFilterSchema).optional()
}).strict();

export const IntentTrackOrderByWithRelationInputSchema: z.ZodType<Prisma.IntentTrackOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  statusId: z.lazy(() => SortOrderSchema).optional(),
  color: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  Hospital: z.lazy(() => HospitalOrderByWithRelationInputSchema).optional(),
  IntentStatus: z.lazy(() => IntentStatusOrderByWithRelationInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentOrderByRelationAggregateInputSchema).optional()
}).strict();

export const IntentTrackWhereUniqueInputSchema: z.ZodType<Prisma.IntentTrackWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => IntentTrackWhereInputSchema),z.lazy(() => IntentTrackWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => IntentTrackWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => IntentTrackWhereInputSchema),z.lazy(() => IntentTrackWhereInputSchema).array() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  statusId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  color: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Hospital: z.union([ z.lazy(() => HospitalRelationFilterSchema),z.lazy(() => HospitalWhereInputSchema) ]).optional(),
  IntentStatus: z.union([ z.lazy(() => IntentStatusRelationFilterSchema),z.lazy(() => IntentStatusWhereInputSchema) ]).optional(),
  ProductIntent: z.lazy(() => ProductIntentListRelationFilterSchema).optional()
}).strict());

export const IntentTrackOrderByWithAggregationInputSchema: z.ZodType<Prisma.IntentTrackOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  statusId: z.lazy(() => SortOrderSchema).optional(),
  color: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => IntentTrackCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => IntentTrackAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => IntentTrackMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => IntentTrackMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => IntentTrackSumOrderByAggregateInputSchema).optional()
}).strict();

export const IntentTrackScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.IntentTrackScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => IntentTrackScalarWhereWithAggregatesInputSchema),z.lazy(() => IntentTrackScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => IntentTrackScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => IntentTrackScalarWhereWithAggregatesInputSchema),z.lazy(() => IntentTrackScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  statusId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  color: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const IntentStatusWhereInputSchema: z.ZodType<Prisma.IntentStatusWhereInput> = z.object({
  AND: z.union([ z.lazy(() => IntentStatusWhereInputSchema),z.lazy(() => IntentStatusWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => IntentStatusWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => IntentStatusWhereInputSchema),z.lazy(() => IntentStatusWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  tracks: z.lazy(() => IntentTrackListRelationFilterSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentListRelationFilterSchema).optional()
}).strict();

export const IntentStatusOrderByWithRelationInputSchema: z.ZodType<Prisma.IntentStatusOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  tracks: z.lazy(() => IntentTrackOrderByRelationAggregateInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentOrderByRelationAggregateInputSchema).optional()
}).strict();

export const IntentStatusWhereUniqueInputSchema: z.ZodType<Prisma.IntentStatusWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => IntentStatusWhereInputSchema),z.lazy(() => IntentStatusWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => IntentStatusWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => IntentStatusWhereInputSchema),z.lazy(() => IntentStatusWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  tracks: z.lazy(() => IntentTrackListRelationFilterSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentListRelationFilterSchema).optional()
}).strict());

export const IntentStatusOrderByWithAggregationInputSchema: z.ZodType<Prisma.IntentStatusOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => IntentStatusCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => IntentStatusAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => IntentStatusMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => IntentStatusMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => IntentStatusSumOrderByAggregateInputSchema).optional()
}).strict();

export const IntentStatusScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.IntentStatusScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => IntentStatusScalarWhereWithAggregatesInputSchema),z.lazy(() => IntentStatusScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => IntentStatusScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => IntentStatusScalarWhereWithAggregatesInputSchema),z.lazy(() => IntentStatusScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ProductIntentWhereInputSchema: z.ZodType<Prisma.ProductIntentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProductIntentWhereInputSchema),z.lazy(() => ProductIntentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductIntentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductIntentWhereInputSchema),z.lazy(() => ProductIntentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  productId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  intentId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  trackId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Hospital: z.union([ z.lazy(() => HospitalRelationFilterSchema),z.lazy(() => HospitalWhereInputSchema) ]).optional(),
  Intent: z.union([ z.lazy(() => IntentStatusRelationFilterSchema),z.lazy(() => IntentStatusWhereInputSchema) ]).optional(),
  Product: z.union([ z.lazy(() => ProductRelationFilterSchema),z.lazy(() => ProductWhereInputSchema) ]).optional(),
  Track: z.union([ z.lazy(() => IntentTrackRelationFilterSchema),z.lazy(() => IntentTrackWhereInputSchema) ]).optional(),
}).strict();

export const ProductIntentOrderByWithRelationInputSchema: z.ZodType<Prisma.ProductIntentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  intentId: z.lazy(() => SortOrderSchema).optional(),
  trackId: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  Hospital: z.lazy(() => HospitalOrderByWithRelationInputSchema).optional(),
  Intent: z.lazy(() => IntentStatusOrderByWithRelationInputSchema).optional(),
  Product: z.lazy(() => ProductOrderByWithRelationInputSchema).optional(),
  Track: z.lazy(() => IntentTrackOrderByWithRelationInputSchema).optional()
}).strict();

export const ProductIntentWhereUniqueInputSchema: z.ZodType<Prisma.ProductIntentWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => ProductIntentWhereInputSchema),z.lazy(() => ProductIntentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductIntentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductIntentWhereInputSchema),z.lazy(() => ProductIntentWhereInputSchema).array() ]).optional(),
  productId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  intentId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  trackId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Hospital: z.union([ z.lazy(() => HospitalRelationFilterSchema),z.lazy(() => HospitalWhereInputSchema) ]).optional(),
  Intent: z.union([ z.lazy(() => IntentStatusRelationFilterSchema),z.lazy(() => IntentStatusWhereInputSchema) ]).optional(),
  Product: z.union([ z.lazy(() => ProductRelationFilterSchema),z.lazy(() => ProductWhereInputSchema) ]).optional(),
  Track: z.union([ z.lazy(() => IntentTrackRelationFilterSchema),z.lazy(() => IntentTrackWhereInputSchema) ]).optional(),
}).strict());

export const ProductIntentOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProductIntentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  intentId: z.lazy(() => SortOrderSchema).optional(),
  trackId: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProductIntentCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProductIntentAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProductIntentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProductIntentMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProductIntentSumOrderByAggregateInputSchema).optional()
}).strict();

export const ProductIntentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProductIntentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProductIntentScalarWhereWithAggregatesInputSchema),z.lazy(() => ProductIntentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductIntentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductIntentScalarWhereWithAggregatesInputSchema),z.lazy(() => ProductIntentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  productId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  intentId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  trackId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PatientWhereInputSchema: z.ZodType<Prisma.PatientWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PatientWhereInputSchema),z.lazy(() => PatientWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PatientWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PatientWhereInputSchema),z.lazy(() => PatientWhereInputSchema).array() ]).optional(),
  uhid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  gender: z.union([ z.lazy(() => EnumGenderFilterSchema),z.lazy(() => GenderSchema) ]).optional(),
  mobile: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dob: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  bornYear: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  aadharNumber: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  aadharName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  bloodGroup: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  pincode: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  isDeleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  fatherName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  Assessment: z.lazy(() => AssessmentListRelationFilterSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitListRelationFilterSchema).optional()
}).strict();

export const PatientOrderByWithRelationInputSchema: z.ZodType<Prisma.PatientOrderByWithRelationInput> = z.object({
  uhid: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  gender: z.lazy(() => SortOrderSchema).optional(),
  mobile: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  dob: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  bornYear: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  aadharNumber: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  aadharName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  bloodGroup: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  address: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  city: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  pincode: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  fatherName: z.lazy(() => SortOrderSchema).optional(),
  Assessment: z.lazy(() => AssessmentOrderByRelationAggregateInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitOrderByRelationAggregateInputSchema).optional()
}).strict();

export const PatientWhereUniqueInputSchema: z.ZodType<Prisma.PatientWhereUniqueInput> = z.object({
  uhid: z.string()
})
.and(z.object({
  uhid: z.string().optional(),
  AND: z.union([ z.lazy(() => PatientWhereInputSchema),z.lazy(() => PatientWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PatientWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PatientWhereInputSchema),z.lazy(() => PatientWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  gender: z.union([ z.lazy(() => EnumGenderFilterSchema),z.lazy(() => GenderSchema) ]).optional(),
  mobile: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  dob: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  bornYear: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  aadharNumber: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  aadharName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  bloodGroup: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  pincode: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  isDeleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  fatherName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  Assessment: z.lazy(() => AssessmentListRelationFilterSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitListRelationFilterSchema).optional()
}).strict());

export const PatientOrderByWithAggregationInputSchema: z.ZodType<Prisma.PatientOrderByWithAggregationInput> = z.object({
  uhid: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  gender: z.lazy(() => SortOrderSchema).optional(),
  mobile: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  dob: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  bornYear: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  aadharNumber: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  aadharName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  bloodGroup: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  address: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  city: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  pincode: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  fatherName: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PatientCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PatientAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PatientMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PatientMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PatientSumOrderByAggregateInputSchema).optional()
}).strict();

export const PatientScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PatientScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PatientScalarWhereWithAggregatesInputSchema),z.lazy(() => PatientScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PatientScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PatientScalarWhereWithAggregatesInputSchema),z.lazy(() => PatientScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  uhid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  gender: z.union([ z.lazy(() => EnumGenderWithAggregatesFilterSchema),z.lazy(() => GenderSchema) ]).optional(),
  mobile: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  dob: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  bornYear: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  aadharNumber: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  aadharName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  bloodGroup: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  pincode: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  updatedBy: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  isDeleted: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  fatherName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const PatientVisitWhereInputSchema: z.ZodType<Prisma.PatientVisitWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PatientVisitWhereInputSchema),z.lazy(() => PatientVisitWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PatientVisitWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PatientVisitWhereInputSchema),z.lazy(() => PatientVisitWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  uhid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  departmentId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  doctorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  checkInTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  checkOutTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  isDeleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Assessment: z.union([ z.lazy(() => AssessmentNullableRelationFilterSchema),z.lazy(() => AssessmentWhereInputSchema) ]).optional().nullable(),
  Department: z.union([ z.lazy(() => DepartmentRelationFilterSchema),z.lazy(() => DepartmentWhereInputSchema) ]).optional(),
  Doctor: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  Hospital: z.union([ z.lazy(() => HospitalRelationFilterSchema),z.lazy(() => HospitalWhereInputSchema) ]).optional(),
  Patient: z.union([ z.lazy(() => PatientRelationFilterSchema),z.lazy(() => PatientWhereInputSchema) ]).optional(),
}).strict();

export const PatientVisitOrderByWithRelationInputSchema: z.ZodType<Prisma.PatientVisitOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  uhid: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  departmentId: z.lazy(() => SortOrderSchema).optional(),
  doctorId: z.lazy(() => SortOrderSchema).optional(),
  checkInTime: z.lazy(() => SortOrderSchema).optional(),
  checkOutTime: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  Assessment: z.lazy(() => AssessmentOrderByWithRelationInputSchema).optional(),
  Department: z.lazy(() => DepartmentOrderByWithRelationInputSchema).optional(),
  Doctor: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  Hospital: z.lazy(() => HospitalOrderByWithRelationInputSchema).optional(),
  Patient: z.lazy(() => PatientOrderByWithRelationInputSchema).optional()
}).strict();

export const PatientVisitWhereUniqueInputSchema: z.ZodType<Prisma.PatientVisitWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => PatientVisitWhereInputSchema),z.lazy(() => PatientVisitWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PatientVisitWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PatientVisitWhereInputSchema),z.lazy(() => PatientVisitWhereInputSchema).array() ]).optional(),
  uhid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  departmentId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  doctorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  checkInTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  checkOutTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  isDeleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Assessment: z.union([ z.lazy(() => AssessmentNullableRelationFilterSchema),z.lazy(() => AssessmentWhereInputSchema) ]).optional().nullable(),
  Department: z.union([ z.lazy(() => DepartmentRelationFilterSchema),z.lazy(() => DepartmentWhereInputSchema) ]).optional(),
  Doctor: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  Hospital: z.union([ z.lazy(() => HospitalRelationFilterSchema),z.lazy(() => HospitalWhereInputSchema) ]).optional(),
  Patient: z.union([ z.lazy(() => PatientRelationFilterSchema),z.lazy(() => PatientWhereInputSchema) ]).optional(),
}).strict());

export const PatientVisitOrderByWithAggregationInputSchema: z.ZodType<Prisma.PatientVisitOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  uhid: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  departmentId: z.lazy(() => SortOrderSchema).optional(),
  doctorId: z.lazy(() => SortOrderSchema).optional(),
  checkInTime: z.lazy(() => SortOrderSchema).optional(),
  checkOutTime: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PatientVisitCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PatientVisitAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PatientVisitMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PatientVisitMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PatientVisitSumOrderByAggregateInputSchema).optional()
}).strict();

export const PatientVisitScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PatientVisitScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PatientVisitScalarWhereWithAggregatesInputSchema),z.lazy(() => PatientVisitScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PatientVisitScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PatientVisitScalarWhereWithAggregatesInputSchema),z.lazy(() => PatientVisitScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  uhid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  departmentId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  doctorId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  checkInTime: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  checkOutTime: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  isDeleted: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const AssessmentWhereInputSchema: z.ZodType<Prisma.AssessmentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AssessmentWhereInputSchema),z.lazy(() => AssessmentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AssessmentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AssessmentWhereInputSchema),z.lazy(() => AssessmentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  uhid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  doctorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  patientVisitId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  complaint: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  currentMedication: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  pastMedicalHistory: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  examination: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  investigation: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  procedureDone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  diagnosis: z.lazy(() => JsonFilterSchema).optional(),
  treatmentGiven: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  followUp: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  followupInstruction: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isDeleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Doctor: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  PatientVisit: z.union([ z.lazy(() => PatientVisitRelationFilterSchema),z.lazy(() => PatientVisitWhereInputSchema) ]).optional(),
  Patient: z.union([ z.lazy(() => PatientRelationFilterSchema),z.lazy(() => PatientWhereInputSchema) ]).optional(),
}).strict();

export const AssessmentOrderByWithRelationInputSchema: z.ZodType<Prisma.AssessmentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  uhid: z.lazy(() => SortOrderSchema).optional(),
  doctorId: z.lazy(() => SortOrderSchema).optional(),
  patientVisitId: z.lazy(() => SortOrderSchema).optional(),
  complaint: z.lazy(() => SortOrderSchema).optional(),
  currentMedication: z.lazy(() => SortOrderSchema).optional(),
  pastMedicalHistory: z.lazy(() => SortOrderSchema).optional(),
  examination: z.lazy(() => SortOrderSchema).optional(),
  investigation: z.lazy(() => SortOrderSchema).optional(),
  procedureDone: z.lazy(() => SortOrderSchema).optional(),
  diagnosis: z.lazy(() => SortOrderSchema).optional(),
  treatmentGiven: z.lazy(() => SortOrderSchema).optional(),
  followUp: z.lazy(() => SortOrderSchema).optional(),
  followupInstruction: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  Doctor: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitOrderByWithRelationInputSchema).optional(),
  Patient: z.lazy(() => PatientOrderByWithRelationInputSchema).optional()
}).strict();

export const AssessmentWhereUniqueInputSchema: z.ZodType<Prisma.AssessmentWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    patientVisitId: z.string()
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    patientVisitId: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  patientVisitId: z.string().optional(),
  AND: z.union([ z.lazy(() => AssessmentWhereInputSchema),z.lazy(() => AssessmentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AssessmentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AssessmentWhereInputSchema),z.lazy(() => AssessmentWhereInputSchema).array() ]).optional(),
  uhid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  doctorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  complaint: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  currentMedication: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  pastMedicalHistory: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  examination: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  investigation: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  procedureDone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  diagnosis: z.lazy(() => JsonFilterSchema).optional(),
  treatmentGiven: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  followUp: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  followupInstruction: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isDeleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Doctor: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  PatientVisit: z.union([ z.lazy(() => PatientVisitRelationFilterSchema),z.lazy(() => PatientVisitWhereInputSchema) ]).optional(),
  Patient: z.union([ z.lazy(() => PatientRelationFilterSchema),z.lazy(() => PatientWhereInputSchema) ]).optional(),
}).strict());

export const AssessmentOrderByWithAggregationInputSchema: z.ZodType<Prisma.AssessmentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  uhid: z.lazy(() => SortOrderSchema).optional(),
  doctorId: z.lazy(() => SortOrderSchema).optional(),
  patientVisitId: z.lazy(() => SortOrderSchema).optional(),
  complaint: z.lazy(() => SortOrderSchema).optional(),
  currentMedication: z.lazy(() => SortOrderSchema).optional(),
  pastMedicalHistory: z.lazy(() => SortOrderSchema).optional(),
  examination: z.lazy(() => SortOrderSchema).optional(),
  investigation: z.lazy(() => SortOrderSchema).optional(),
  procedureDone: z.lazy(() => SortOrderSchema).optional(),
  diagnosis: z.lazy(() => SortOrderSchema).optional(),
  treatmentGiven: z.lazy(() => SortOrderSchema).optional(),
  followUp: z.lazy(() => SortOrderSchema).optional(),
  followupInstruction: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AssessmentCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AssessmentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AssessmentMinOrderByAggregateInputSchema).optional()
}).strict();

export const AssessmentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AssessmentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AssessmentScalarWhereWithAggregatesInputSchema),z.lazy(() => AssessmentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AssessmentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AssessmentScalarWhereWithAggregatesInputSchema),z.lazy(() => AssessmentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  uhid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  doctorId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  patientVisitId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  complaint: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  currentMedication: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  pastMedicalHistory: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  examination: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  investigation: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  procedureDone: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  diagnosis: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  treatmentGiven: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  followUp: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  followupInstruction: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  isDeleted: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const HospitalCreateInputSchema: z.ZodType<Prisma.HospitalCreateInput> = z.object({
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentCreateNestedManyWithoutHospitalInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackCreateNestedManyWithoutHospitalInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutHospitalInputSchema).optional(),
  Permission: z.lazy(() => PermissionCreateNestedManyWithoutHospitalInputSchema).optional(),
  Product: z.lazy(() => ProductCreateNestedManyWithoutHospitalInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentCreateNestedManyWithoutHospitalInputSchema).optional(),
  Role: z.lazy(() => RoleCreateNestedManyWithoutHospitalInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedManyWithoutHospitalInputSchema).optional(),
  Vendor: z.lazy(() => VendorCreateNestedManyWithoutHospitalInputSchema).optional()
}).strict();

export const HospitalUncheckedCreateInputSchema: z.ZodType<Prisma.HospitalUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Permission: z.lazy(() => PermissionUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Role: z.lazy(() => RoleUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Vendor: z.lazy(() => VendorUncheckedCreateNestedManyWithoutHospitalInputSchema).optional()
}).strict();

export const HospitalUpdateInputSchema: z.ZodType<Prisma.HospitalUpdateInput> = z.object({
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUpdateManyWithoutHospitalNestedInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUpdateManyWithoutHospitalNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Permission: z.lazy(() => PermissionUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUpdateManyWithoutHospitalNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUpdateManyWithoutHospitalNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Vendor: z.lazy(() => VendorUpdateManyWithoutHospitalNestedInputSchema).optional()
}).strict();

export const HospitalUncheckedUpdateInputSchema: z.ZodType<Prisma.HospitalUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Permission: z.lazy(() => PermissionUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Vendor: z.lazy(() => VendorUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional()
}).strict();

export const HospitalCreateManyInputSchema: z.ZodType<Prisma.HospitalCreateManyInput> = z.object({
  id: z.number().int().optional(),
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const HospitalUpdateManyMutationInputSchema: z.ZodType<Prisma.HospitalUpdateManyMutationInput> = z.object({
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const HospitalUncheckedUpdateManyInputSchema: z.ZodType<Prisma.HospitalUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DepartmentCreateInputSchema: z.ZodType<Prisma.DepartmentCreateInput> = z.object({
  name: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutDepartmentInputSchema),
  Role: z.lazy(() => RoleCreateNestedOneWithoutDepartmentInputSchema),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutDepartmentInputSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentCreateNestedManyWithoutDepartmentInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedManyWithoutDepartmentInputSchema).optional()
}).strict();

export const DepartmentUncheckedCreateInputSchema: z.ZodType<Prisma.DepartmentUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  hospitalId: z.number().int(),
  roleId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutDepartmentInputSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUncheckedCreateNestedManyWithoutDepartmentInputSchema).optional(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutDepartmentInputSchema).optional()
}).strict();

export const DepartmentUpdateInputSchema: z.ZodType<Prisma.DepartmentUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutDepartmentNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUpdateOneRequiredWithoutDepartmentNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutDepartmentNestedInputSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUpdateManyWithoutDepartmentNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateManyWithoutDepartmentNestedInputSchema).optional()
}).strict();

export const DepartmentUncheckedUpdateInputSchema: z.ZodType<Prisma.DepartmentUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutDepartmentNestedInputSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUncheckedUpdateManyWithoutDepartmentNestedInputSchema).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutDepartmentNestedInputSchema).optional()
}).strict();

export const DepartmentCreateManyInputSchema: z.ZodType<Prisma.DepartmentCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  hospitalId: z.number().int(),
  roleId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const DepartmentUpdateManyMutationInputSchema: z.ZodType<Prisma.DepartmentUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DepartmentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DepartmentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  isActive: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentCreateNestedManyWithoutDoctorInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutDoctorInputSchema).optional(),
  Department: z.lazy(() => DepartmentCreateNestedOneWithoutUserInputSchema),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutUserInputSchema),
  UserLogin: z.lazy(() => UserLoginCreateNestedOneWithoutUserInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  hospitalId: z.number().int(),
  department: z.number().int(),
  isActive: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentUncheckedCreateNestedManyWithoutDoctorInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutDoctorInputSchema).optional(),
  UserLogin: z.lazy(() => UserLoginUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUpdateManyWithoutDoctorNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutDoctorNestedInputSchema).optional(),
  Department: z.lazy(() => DepartmentUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  UserLogin: z.lazy(() => UserLoginUpdateOneWithoutUserNestedInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  department: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUncheckedUpdateManyWithoutDoctorNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutDoctorNestedInputSchema).optional(),
  UserLogin: z.lazy(() => UserLoginUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  hospitalId: z.number().int(),
  department: z.number().int(),
  isActive: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  department: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserLoginCreateInputSchema: z.ZodType<Prisma.UserLoginCreateInput> = z.object({
  password: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutUserLoginInputSchema)
}).strict();

export const UserLoginUncheckedCreateInputSchema: z.ZodType<Prisma.UserLoginUncheckedCreateInput> = z.object({
  userId: z.string(),
  password: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserLoginUpdateInputSchema: z.ZodType<Prisma.UserLoginUpdateInput> = z.object({
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutUserLoginNestedInputSchema).optional()
}).strict();

export const UserLoginUncheckedUpdateInputSchema: z.ZodType<Prisma.UserLoginUncheckedUpdateInput> = z.object({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserLoginCreateManyInputSchema: z.ZodType<Prisma.UserLoginCreateManyInput> = z.object({
  userId: z.string(),
  password: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserLoginUpdateManyMutationInputSchema: z.ZodType<Prisma.UserLoginUpdateManyMutationInput> = z.object({
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserLoginUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserLoginUncheckedUpdateManyInput> = z.object({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RoleCreateInputSchema: z.ZodType<Prisma.RoleCreateInput> = z.object({
  roleName: z.string(),
  description: z.string().optional().nullable(),
  isSuperAdmin: z.boolean().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentCreateNestedManyWithoutRoleInputSchema).optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutRoleInputSchema),
  permissions: z.lazy(() => RolePermissionCreateNestedManyWithoutRoleInputSchema).optional(),
  roleUsers: z.lazy(() => UserRoleCreateNestedManyWithoutRoleInputSchema).optional()
}).strict();

export const RoleUncheckedCreateInputSchema: z.ZodType<Prisma.RoleUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  roleName: z.string(),
  description: z.string().optional().nullable(),
  hospitalId: z.number().int(),
  isSuperAdmin: z.boolean().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentUncheckedCreateNestedManyWithoutRoleInputSchema).optional(),
  permissions: z.lazy(() => RolePermissionUncheckedCreateNestedManyWithoutRoleInputSchema).optional(),
  roleUsers: z.lazy(() => UserRoleUncheckedCreateNestedManyWithoutRoleInputSchema).optional()
}).strict();

export const RoleUpdateInputSchema: z.ZodType<Prisma.RoleUpdateInput> = z.object({
  roleName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isSuperAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUpdateManyWithoutRoleNestedInputSchema).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutRoleNestedInputSchema).optional(),
  permissions: z.lazy(() => RolePermissionUpdateManyWithoutRoleNestedInputSchema).optional(),
  roleUsers: z.lazy(() => UserRoleUpdateManyWithoutRoleNestedInputSchema).optional()
}).strict();

export const RoleUncheckedUpdateInputSchema: z.ZodType<Prisma.RoleUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  roleName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isSuperAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUncheckedUpdateManyWithoutRoleNestedInputSchema).optional(),
  permissions: z.lazy(() => RolePermissionUncheckedUpdateManyWithoutRoleNestedInputSchema).optional(),
  roleUsers: z.lazy(() => UserRoleUncheckedUpdateManyWithoutRoleNestedInputSchema).optional()
}).strict();

export const RoleCreateManyInputSchema: z.ZodType<Prisma.RoleCreateManyInput> = z.object({
  id: z.number().int().optional(),
  roleName: z.string(),
  description: z.string().optional().nullable(),
  hospitalId: z.number().int(),
  isSuperAdmin: z.boolean().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const RoleUpdateManyMutationInputSchema: z.ZodType<Prisma.RoleUpdateManyMutationInput> = z.object({
  roleName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isSuperAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RoleUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RoleUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  roleName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isSuperAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserRoleCreateInputSchema: z.ZodType<Prisma.UserRoleCreateInput> = z.object({
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  role: z.lazy(() => RoleCreateNestedOneWithoutRoleUsersInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutUserRoleInputSchema)
}).strict();

export const UserRoleUncheckedCreateInputSchema: z.ZodType<Prisma.UserRoleUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  userId: z.string(),
  roleId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserRoleUpdateInputSchema: z.ZodType<Prisma.UserRoleUpdateInput> = z.object({
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.lazy(() => RoleUpdateOneRequiredWithoutRoleUsersNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutUserRoleNestedInputSchema).optional()
}).strict();

export const UserRoleUncheckedUpdateInputSchema: z.ZodType<Prisma.UserRoleUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserRoleCreateManyInputSchema: z.ZodType<Prisma.UserRoleCreateManyInput> = z.object({
  id: z.number().int().optional(),
  userId: z.string(),
  roleId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserRoleUpdateManyMutationInputSchema: z.ZodType<Prisma.UserRoleUpdateManyMutationInput> = z.object({
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserRoleUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserRoleUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PermissionCreateInputSchema: z.ZodType<Prisma.PermissionCreateInput> = z.object({
  permissionName: z.string(),
  description: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutPermissionInputSchema),
  rolePermissions: z.lazy(() => RolePermissionCreateNestedManyWithoutPermissionInputSchema).optional()
}).strict();

export const PermissionUncheckedCreateInputSchema: z.ZodType<Prisma.PermissionUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  permissionName: z.string(),
  description: z.string().optional().nullable(),
  hospitalId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  rolePermissions: z.lazy(() => RolePermissionUncheckedCreateNestedManyWithoutPermissionInputSchema).optional()
}).strict();

export const PermissionUpdateInputSchema: z.ZodType<Prisma.PermissionUpdateInput> = z.object({
  permissionName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutPermissionNestedInputSchema).optional(),
  rolePermissions: z.lazy(() => RolePermissionUpdateManyWithoutPermissionNestedInputSchema).optional()
}).strict();

export const PermissionUncheckedUpdateInputSchema: z.ZodType<Prisma.PermissionUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  permissionName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  rolePermissions: z.lazy(() => RolePermissionUncheckedUpdateManyWithoutPermissionNestedInputSchema).optional()
}).strict();

export const PermissionCreateManyInputSchema: z.ZodType<Prisma.PermissionCreateManyInput> = z.object({
  id: z.number().int().optional(),
  permissionName: z.string(),
  description: z.string().optional().nullable(),
  hospitalId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PermissionUpdateManyMutationInputSchema: z.ZodType<Prisma.PermissionUpdateManyMutationInput> = z.object({
  permissionName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PermissionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PermissionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  permissionName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RolePermissionCreateInputSchema: z.ZodType<Prisma.RolePermissionCreateInput> = z.object({
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  permission: z.lazy(() => PermissionCreateNestedOneWithoutRolePermissionsInputSchema),
  role: z.lazy(() => RoleCreateNestedOneWithoutPermissionsInputSchema)
}).strict();

export const RolePermissionUncheckedCreateInputSchema: z.ZodType<Prisma.RolePermissionUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  roleId: z.number().int(),
  permissionId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const RolePermissionUpdateInputSchema: z.ZodType<Prisma.RolePermissionUpdateInput> = z.object({
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  permission: z.lazy(() => PermissionUpdateOneRequiredWithoutRolePermissionsNestedInputSchema).optional(),
  role: z.lazy(() => RoleUpdateOneRequiredWithoutPermissionsNestedInputSchema).optional()
}).strict();

export const RolePermissionUncheckedUpdateInputSchema: z.ZodType<Prisma.RolePermissionUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  permissionId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RolePermissionCreateManyInputSchema: z.ZodType<Prisma.RolePermissionCreateManyInput> = z.object({
  id: z.number().int().optional(),
  roleId: z.number().int(),
  permissionId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const RolePermissionUpdateManyMutationInputSchema: z.ZodType<Prisma.RolePermissionUpdateManyMutationInput> = z.object({
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RolePermissionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RolePermissionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  permissionId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VendorCreateInputSchema: z.ZodType<Prisma.VendorCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  address: z.string(),
  gstNumber: z.string(),
  branchName: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutVendorInputSchema)
}).strict();

export const VendorUncheckedCreateInputSchema: z.ZodType<Prisma.VendorUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  address: z.string(),
  gstNumber: z.string(),
  branchName: z.string(),
  hospitalId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const VendorUpdateInputSchema: z.ZodType<Prisma.VendorUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gstNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  branchName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutVendorNestedInputSchema).optional()
}).strict();

export const VendorUncheckedUpdateInputSchema: z.ZodType<Prisma.VendorUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gstNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  branchName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VendorCreateManyInputSchema: z.ZodType<Prisma.VendorCreateManyInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  address: z.string(),
  gstNumber: z.string(),
  branchName: z.string(),
  hospitalId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const VendorUpdateManyMutationInputSchema: z.ZodType<Prisma.VendorUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gstNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  branchName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VendorUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VendorUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gstNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  branchName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductCreateInputSchema: z.ZodType<Prisma.ProductCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  sku: z.string(),
  hsnCode: z.string(),
  genericName: z.string(),
  brandName: z.string(),
  manufacturer: z.string(),
  dosageForm: z.string(),
  strength: z.string(),
  purchaseRate: z.number(),
  saleRate: z.number(),
  mrp: z.number(),
  maxDiscount: z.number(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutProductInputSchema),
  ProductDepartment: z.lazy(() => ProductDepartmentCreateNestedManyWithoutProductInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductUncheckedCreateInputSchema: z.ZodType<Prisma.ProductUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  sku: z.string(),
  hsnCode: z.string(),
  genericName: z.string(),
  brandName: z.string(),
  manufacturer: z.string(),
  dosageForm: z.string(),
  strength: z.string(),
  purchaseRate: z.number(),
  saleRate: z.number(),
  mrp: z.number(),
  maxDiscount: z.number(),
  hospitalId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUncheckedCreateNestedManyWithoutProductInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductUpdateInputSchema: z.ZodType<Prisma.ProductUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hsnCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  genericName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brandName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  manufacturer: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dosageForm: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  strength: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  purchaseRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  saleRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  mrp: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  maxDiscount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutProductNestedInputSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUpdateManyWithoutProductNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const ProductUncheckedUpdateInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hsnCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  genericName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brandName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  manufacturer: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dosageForm: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  strength: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  purchaseRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  saleRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  mrp: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  maxDiscount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUncheckedUpdateManyWithoutProductNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const ProductCreateManyInputSchema: z.ZodType<Prisma.ProductCreateManyInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  sku: z.string(),
  hsnCode: z.string(),
  genericName: z.string(),
  brandName: z.string(),
  manufacturer: z.string(),
  dosageForm: z.string(),
  strength: z.string(),
  purchaseRate: z.number(),
  saleRate: z.number(),
  mrp: z.number(),
  maxDiscount: z.number(),
  hospitalId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductUpdateManyMutationInputSchema: z.ZodType<Prisma.ProductUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hsnCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  genericName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brandName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  manufacturer: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dosageForm: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  strength: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  purchaseRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  saleRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  mrp: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  maxDiscount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hsnCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  genericName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brandName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  manufacturer: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dosageForm: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  strength: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  purchaseRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  saleRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  mrp: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  maxDiscount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductDepartmentCreateInputSchema: z.ZodType<Prisma.ProductDepartmentCreateInput> = z.object({
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentCreateNestedOneWithoutProductDepartmentInputSchema),
  Product: z.lazy(() => ProductCreateNestedOneWithoutProductDepartmentInputSchema)
}).strict();

export const ProductDepartmentUncheckedCreateInputSchema: z.ZodType<Prisma.ProductDepartmentUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  productId: z.string(),
  departmentId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductDepartmentUpdateInputSchema: z.ZodType<Prisma.ProductDepartmentUpdateInput> = z.object({
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUpdateOneRequiredWithoutProductDepartmentNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUpdateOneRequiredWithoutProductDepartmentNestedInputSchema).optional()
}).strict();

export const ProductDepartmentUncheckedUpdateInputSchema: z.ZodType<Prisma.ProductDepartmentUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  departmentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductDepartmentCreateManyInputSchema: z.ZodType<Prisma.ProductDepartmentCreateManyInput> = z.object({
  id: z.number().int().optional(),
  productId: z.string(),
  departmentId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductDepartmentUpdateManyMutationInputSchema: z.ZodType<Prisma.ProductDepartmentUpdateManyMutationInput> = z.object({
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductDepartmentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProductDepartmentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  departmentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntentTrackCreateInputSchema: z.ZodType<Prisma.IntentTrackCreateInput> = z.object({
  color: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutIntentTrackInputSchema),
  IntentStatus: z.lazy(() => IntentStatusCreateNestedOneWithoutTracksInputSchema),
  ProductIntent: z.lazy(() => ProductIntentCreateNestedManyWithoutTrackInputSchema).optional()
}).strict();

export const IntentTrackUncheckedCreateInputSchema: z.ZodType<Prisma.IntentTrackUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  hospitalId: z.number().int(),
  statusId: z.number().int(),
  color: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedCreateNestedManyWithoutTrackInputSchema).optional()
}).strict();

export const IntentTrackUpdateInputSchema: z.ZodType<Prisma.IntentTrackUpdateInput> = z.object({
  color: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutIntentTrackNestedInputSchema).optional(),
  IntentStatus: z.lazy(() => IntentStatusUpdateOneRequiredWithoutTracksNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUpdateManyWithoutTrackNestedInputSchema).optional()
}).strict();

export const IntentTrackUncheckedUpdateInputSchema: z.ZodType<Prisma.IntentTrackUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  statusId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  color: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedUpdateManyWithoutTrackNestedInputSchema).optional()
}).strict();

export const IntentTrackCreateManyInputSchema: z.ZodType<Prisma.IntentTrackCreateManyInput> = z.object({
  id: z.number().int().optional(),
  hospitalId: z.number().int(),
  statusId: z.number().int(),
  color: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const IntentTrackUpdateManyMutationInputSchema: z.ZodType<Prisma.IntentTrackUpdateManyMutationInput> = z.object({
  color: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntentTrackUncheckedUpdateManyInputSchema: z.ZodType<Prisma.IntentTrackUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  statusId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  color: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntentStatusCreateInputSchema: z.ZodType<Prisma.IntentStatusCreateInput> = z.object({
  name: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tracks: z.lazy(() => IntentTrackCreateNestedManyWithoutIntentStatusInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentCreateNestedManyWithoutIntentInputSchema).optional()
}).strict();

export const IntentStatusUncheckedCreateInputSchema: z.ZodType<Prisma.IntentStatusUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tracks: z.lazy(() => IntentTrackUncheckedCreateNestedManyWithoutIntentStatusInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedCreateNestedManyWithoutIntentInputSchema).optional()
}).strict();

export const IntentStatusUpdateInputSchema: z.ZodType<Prisma.IntentStatusUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tracks: z.lazy(() => IntentTrackUpdateManyWithoutIntentStatusNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUpdateManyWithoutIntentNestedInputSchema).optional()
}).strict();

export const IntentStatusUncheckedUpdateInputSchema: z.ZodType<Prisma.IntentStatusUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tracks: z.lazy(() => IntentTrackUncheckedUpdateManyWithoutIntentStatusNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedUpdateManyWithoutIntentNestedInputSchema).optional()
}).strict();

export const IntentStatusCreateManyInputSchema: z.ZodType<Prisma.IntentStatusCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const IntentStatusUpdateManyMutationInputSchema: z.ZodType<Prisma.IntentStatusUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntentStatusUncheckedUpdateManyInputSchema: z.ZodType<Prisma.IntentStatusUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductIntentCreateInputSchema: z.ZodType<Prisma.ProductIntentCreateInput> = z.object({
  id: z.string().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutProductIntentInputSchema),
  Intent: z.lazy(() => IntentStatusCreateNestedOneWithoutProductIntentInputSchema),
  Product: z.lazy(() => ProductCreateNestedOneWithoutProductIntentInputSchema),
  Track: z.lazy(() => IntentTrackCreateNestedOneWithoutProductIntentInputSchema)
}).strict();

export const ProductIntentUncheckedCreateInputSchema: z.ZodType<Prisma.ProductIntentUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  productId: z.string(),
  intentId: z.number().int(),
  trackId: z.number().int(),
  hospitalId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductIntentUpdateInputSchema: z.ZodType<Prisma.ProductIntentUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutProductIntentNestedInputSchema).optional(),
  Intent: z.lazy(() => IntentStatusUpdateOneRequiredWithoutProductIntentNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUpdateOneRequiredWithoutProductIntentNestedInputSchema).optional(),
  Track: z.lazy(() => IntentTrackUpdateOneRequiredWithoutProductIntentNestedInputSchema).optional()
}).strict();

export const ProductIntentUncheckedUpdateInputSchema: z.ZodType<Prisma.ProductIntentUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  intentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  trackId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductIntentCreateManyInputSchema: z.ZodType<Prisma.ProductIntentCreateManyInput> = z.object({
  id: z.string().optional(),
  productId: z.string(),
  intentId: z.number().int(),
  trackId: z.number().int(),
  hospitalId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductIntentUpdateManyMutationInputSchema: z.ZodType<Prisma.ProductIntentUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductIntentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProductIntentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  intentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  trackId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PatientCreateInputSchema: z.ZodType<Prisma.PatientCreateInput> = z.object({
  uhid: z.string().optional(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  mobile: z.string(),
  hospitalId: z.number().int(),
  dob: z.coerce.date().optional().nullable(),
  bornYear: z.number().int().optional().nullable(),
  aadharNumber: z.string().optional().nullable(),
  aadharName: z.string().optional().nullable(),
  bloodGroup: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional(),
  fatherName: z.string(),
  Assessment: z.lazy(() => AssessmentCreateNestedManyWithoutPatientInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutPatientInputSchema).optional()
}).strict();

export const PatientUncheckedCreateInputSchema: z.ZodType<Prisma.PatientUncheckedCreateInput> = z.object({
  uhid: z.string().optional(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  mobile: z.string(),
  hospitalId: z.number().int(),
  dob: z.coerce.date().optional().nullable(),
  bornYear: z.number().int().optional().nullable(),
  aadharNumber: z.string().optional().nullable(),
  aadharName: z.string().optional().nullable(),
  bloodGroup: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional(),
  fatherName: z.string(),
  Assessment: z.lazy(() => AssessmentUncheckedCreateNestedManyWithoutPatientInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutPatientInputSchema).optional()
}).strict();

export const PatientUpdateInputSchema: z.ZodType<Prisma.PatientUpdateInput> = z.object({
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  mobile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bornYear: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aadharNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aadharName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bloodGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pincode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  fatherName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUpdateManyWithoutPatientNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutPatientNestedInputSchema).optional()
}).strict();

export const PatientUncheckedUpdateInputSchema: z.ZodType<Prisma.PatientUncheckedUpdateInput> = z.object({
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  mobile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bornYear: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aadharNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aadharName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bloodGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pincode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  fatherName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUncheckedUpdateManyWithoutPatientNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutPatientNestedInputSchema).optional()
}).strict();

export const PatientCreateManyInputSchema: z.ZodType<Prisma.PatientCreateManyInput> = z.object({
  uhid: z.string().optional(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  mobile: z.string(),
  hospitalId: z.number().int(),
  dob: z.coerce.date().optional().nullable(),
  bornYear: z.number().int().optional().nullable(),
  aadharNumber: z.string().optional().nullable(),
  aadharName: z.string().optional().nullable(),
  bloodGroup: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional(),
  fatherName: z.string()
}).strict();

export const PatientUpdateManyMutationInputSchema: z.ZodType<Prisma.PatientUpdateManyMutationInput> = z.object({
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  mobile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bornYear: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aadharNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aadharName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bloodGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pincode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  fatherName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PatientUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PatientUncheckedUpdateManyInput> = z.object({
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  mobile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bornYear: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aadharNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aadharName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bloodGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pincode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  fatherName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PatientVisitCreateInputSchema: z.ZodType<Prisma.PatientVisitCreateInput> = z.object({
  id: z.string().optional(),
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentCreateNestedOneWithoutPatientVisitInputSchema).optional(),
  Department: z.lazy(() => DepartmentCreateNestedOneWithoutPatientVisitInputSchema),
  Doctor: z.lazy(() => UserCreateNestedOneWithoutPatientVisitInputSchema),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutPatientVisitInputSchema),
  Patient: z.lazy(() => PatientCreateNestedOneWithoutPatientVisitInputSchema)
}).strict();

export const PatientVisitUncheckedCreateInputSchema: z.ZodType<Prisma.PatientVisitUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  uhid: z.string(),
  hospitalId: z.number().int(),
  departmentId: z.number().int(),
  doctorId: z.string(),
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentUncheckedCreateNestedOneWithoutPatientVisitInputSchema).optional()
}).strict();

export const PatientVisitUpdateInputSchema: z.ZodType<Prisma.PatientVisitUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  checkInTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  checkOutTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUpdateOneWithoutPatientVisitNestedInputSchema).optional(),
  Department: z.lazy(() => DepartmentUpdateOneRequiredWithoutPatientVisitNestedInputSchema).optional(),
  Doctor: z.lazy(() => UserUpdateOneRequiredWithoutPatientVisitNestedInputSchema).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutPatientVisitNestedInputSchema).optional(),
  Patient: z.lazy(() => PatientUpdateOneRequiredWithoutPatientVisitNestedInputSchema).optional()
}).strict();

export const PatientVisitUncheckedUpdateInputSchema: z.ZodType<Prisma.PatientVisitUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  departmentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  doctorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  checkInTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  checkOutTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUncheckedUpdateOneWithoutPatientVisitNestedInputSchema).optional()
}).strict();

export const PatientVisitCreateManyInputSchema: z.ZodType<Prisma.PatientVisitCreateManyInput> = z.object({
  id: z.string().optional(),
  uhid: z.string(),
  hospitalId: z.number().int(),
  departmentId: z.number().int(),
  doctorId: z.string(),
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PatientVisitUpdateManyMutationInputSchema: z.ZodType<Prisma.PatientVisitUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  checkInTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  checkOutTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PatientVisitUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PatientVisitUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  departmentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  doctorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  checkInTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  checkOutTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AssessmentCreateInputSchema: z.ZodType<Prisma.AssessmentCreateInput> = z.object({
  id: z.string().optional(),
  complaint: z.string(),
  currentMedication: z.string(),
  pastMedicalHistory: z.string(),
  examination: z.string(),
  investigation: z.string(),
  procedureDone: z.string(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  treatmentGiven: z.string(),
  followUp: z.coerce.date(),
  followupInstruction: z.string(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Doctor: z.lazy(() => UserCreateNestedOneWithoutAssessmentInputSchema),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedOneWithoutAssessmentInputSchema),
  Patient: z.lazy(() => PatientCreateNestedOneWithoutAssessmentInputSchema)
}).strict();

export const AssessmentUncheckedCreateInputSchema: z.ZodType<Prisma.AssessmentUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  uhid: z.string(),
  doctorId: z.string(),
  patientVisitId: z.string(),
  complaint: z.string(),
  currentMedication: z.string(),
  pastMedicalHistory: z.string(),
  examination: z.string(),
  investigation: z.string(),
  procedureDone: z.string(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  treatmentGiven: z.string(),
  followUp: z.coerce.date(),
  followupInstruction: z.string(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AssessmentUpdateInputSchema: z.ZodType<Prisma.AssessmentUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  complaint: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currentMedication: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pastMedicalHistory: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  examination: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investigation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  procedureDone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  treatmentGiven: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  followUp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  followupInstruction: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Doctor: z.lazy(() => UserUpdateOneRequiredWithoutAssessmentNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateOneRequiredWithoutAssessmentNestedInputSchema).optional(),
  Patient: z.lazy(() => PatientUpdateOneRequiredWithoutAssessmentNestedInputSchema).optional()
}).strict();

export const AssessmentUncheckedUpdateInputSchema: z.ZodType<Prisma.AssessmentUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  doctorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  patientVisitId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  complaint: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currentMedication: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pastMedicalHistory: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  examination: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investigation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  procedureDone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  treatmentGiven: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  followUp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  followupInstruction: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AssessmentCreateManyInputSchema: z.ZodType<Prisma.AssessmentCreateManyInput> = z.object({
  id: z.string().optional(),
  uhid: z.string(),
  doctorId: z.string(),
  patientVisitId: z.string(),
  complaint: z.string(),
  currentMedication: z.string(),
  pastMedicalHistory: z.string(),
  examination: z.string(),
  investigation: z.string(),
  procedureDone: z.string(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  treatmentGiven: z.string(),
  followUp: z.coerce.date(),
  followupInstruction: z.string(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AssessmentUpdateManyMutationInputSchema: z.ZodType<Prisma.AssessmentUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  complaint: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currentMedication: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pastMedicalHistory: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  examination: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investigation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  procedureDone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  treatmentGiven: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  followUp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  followupInstruction: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AssessmentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AssessmentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  doctorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  patientVisitId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  complaint: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currentMedication: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pastMedicalHistory: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  examination: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investigation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  procedureDone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  treatmentGiven: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  followUp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  followupInstruction: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const DepartmentListRelationFilterSchema: z.ZodType<Prisma.DepartmentListRelationFilter> = z.object({
  every: z.lazy(() => DepartmentWhereInputSchema).optional(),
  some: z.lazy(() => DepartmentWhereInputSchema).optional(),
  none: z.lazy(() => DepartmentWhereInputSchema).optional()
}).strict();

export const IntentTrackListRelationFilterSchema: z.ZodType<Prisma.IntentTrackListRelationFilter> = z.object({
  every: z.lazy(() => IntentTrackWhereInputSchema).optional(),
  some: z.lazy(() => IntentTrackWhereInputSchema).optional(),
  none: z.lazy(() => IntentTrackWhereInputSchema).optional()
}).strict();

export const PatientVisitListRelationFilterSchema: z.ZodType<Prisma.PatientVisitListRelationFilter> = z.object({
  every: z.lazy(() => PatientVisitWhereInputSchema).optional(),
  some: z.lazy(() => PatientVisitWhereInputSchema).optional(),
  none: z.lazy(() => PatientVisitWhereInputSchema).optional()
}).strict();

export const PermissionListRelationFilterSchema: z.ZodType<Prisma.PermissionListRelationFilter> = z.object({
  every: z.lazy(() => PermissionWhereInputSchema).optional(),
  some: z.lazy(() => PermissionWhereInputSchema).optional(),
  none: z.lazy(() => PermissionWhereInputSchema).optional()
}).strict();

export const ProductListRelationFilterSchema: z.ZodType<Prisma.ProductListRelationFilter> = z.object({
  every: z.lazy(() => ProductWhereInputSchema).optional(),
  some: z.lazy(() => ProductWhereInputSchema).optional(),
  none: z.lazy(() => ProductWhereInputSchema).optional()
}).strict();

export const ProductIntentListRelationFilterSchema: z.ZodType<Prisma.ProductIntentListRelationFilter> = z.object({
  every: z.lazy(() => ProductIntentWhereInputSchema).optional(),
  some: z.lazy(() => ProductIntentWhereInputSchema).optional(),
  none: z.lazy(() => ProductIntentWhereInputSchema).optional()
}).strict();

export const RoleListRelationFilterSchema: z.ZodType<Prisma.RoleListRelationFilter> = z.object({
  every: z.lazy(() => RoleWhereInputSchema).optional(),
  some: z.lazy(() => RoleWhereInputSchema).optional(),
  none: z.lazy(() => RoleWhereInputSchema).optional()
}).strict();

export const UserListRelationFilterSchema: z.ZodType<Prisma.UserListRelationFilter> = z.object({
  every: z.lazy(() => UserWhereInputSchema).optional(),
  some: z.lazy(() => UserWhereInputSchema).optional(),
  none: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const VendorListRelationFilterSchema: z.ZodType<Prisma.VendorListRelationFilter> = z.object({
  every: z.lazy(() => VendorWhereInputSchema).optional(),
  some: z.lazy(() => VendorWhereInputSchema).optional(),
  none: z.lazy(() => VendorWhereInputSchema).optional()
}).strict();

export const DepartmentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DepartmentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntentTrackOrderByRelationAggregateInputSchema: z.ZodType<Prisma.IntentTrackOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PatientVisitOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PatientVisitOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PermissionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PermissionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ProductOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductIntentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ProductIntentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoleOrderByRelationAggregateInputSchema: z.ZodType<Prisma.RoleOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UserOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VendorOrderByRelationAggregateInputSchema: z.ZodType<Prisma.VendorOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const HospitalCountOrderByAggregateInputSchema: z.ZodType<Prisma.HospitalCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hospitalName: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const HospitalAvgOrderByAggregateInputSchema: z.ZodType<Prisma.HospitalAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const HospitalMaxOrderByAggregateInputSchema: z.ZodType<Prisma.HospitalMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hospitalName: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const HospitalMinOrderByAggregateInputSchema: z.ZodType<Prisma.HospitalMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hospitalName: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const HospitalSumOrderByAggregateInputSchema: z.ZodType<Prisma.HospitalSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const HospitalRelationFilterSchema: z.ZodType<Prisma.HospitalRelationFilter> = z.object({
  is: z.lazy(() => HospitalWhereInputSchema).optional(),
  isNot: z.lazy(() => HospitalWhereInputSchema).optional()
}).strict();

export const RoleRelationFilterSchema: z.ZodType<Prisma.RoleRelationFilter> = z.object({
  is: z.lazy(() => RoleWhereInputSchema).optional(),
  isNot: z.lazy(() => RoleWhereInputSchema).optional()
}).strict();

export const ProductDepartmentListRelationFilterSchema: z.ZodType<Prisma.ProductDepartmentListRelationFilter> = z.object({
  every: z.lazy(() => ProductDepartmentWhereInputSchema).optional(),
  some: z.lazy(() => ProductDepartmentWhereInputSchema).optional(),
  none: z.lazy(() => ProductDepartmentWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const ProductDepartmentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ProductDepartmentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DepartmentCountOrderByAggregateInputSchema: z.ZodType<Prisma.DepartmentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DepartmentAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DepartmentAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DepartmentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DepartmentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DepartmentMinOrderByAggregateInputSchema: z.ZodType<Prisma.DepartmentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DepartmentSumOrderByAggregateInputSchema: z.ZodType<Prisma.DepartmentSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const AssessmentListRelationFilterSchema: z.ZodType<Prisma.AssessmentListRelationFilter> = z.object({
  every: z.lazy(() => AssessmentWhereInputSchema).optional(),
  some: z.lazy(() => AssessmentWhereInputSchema).optional(),
  none: z.lazy(() => AssessmentWhereInputSchema).optional()
}).strict();

export const DepartmentRelationFilterSchema: z.ZodType<Prisma.DepartmentRelationFilter> = z.object({
  is: z.lazy(() => DepartmentWhereInputSchema).optional(),
  isNot: z.lazy(() => DepartmentWhereInputSchema).optional()
}).strict();

export const UserLoginNullableRelationFilterSchema: z.ZodType<Prisma.UserLoginNullableRelationFilter> = z.object({
  is: z.lazy(() => UserLoginWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => UserLoginWhereInputSchema).optional().nullable()
}).strict();

export const UserRoleListRelationFilterSchema: z.ZodType<Prisma.UserRoleListRelationFilter> = z.object({
  every: z.lazy(() => UserRoleWhereInputSchema).optional(),
  some: z.lazy(() => UserRoleWhereInputSchema).optional(),
  none: z.lazy(() => UserRoleWhereInputSchema).optional()
}).strict();

export const AssessmentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AssessmentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserRoleOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UserRoleOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserEmailHospitalIdCompoundUniqueInputSchema: z.ZodType<Prisma.UserEmailHospitalIdCompoundUniqueInput> = z.object({
  email: z.string(),
  hospitalId: z.number()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  department: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserAvgOrderByAggregateInput> = z.object({
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  department: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  department: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  department: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserSumOrderByAggregateInput> = z.object({
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  department: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserLoginCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserLoginCountOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserLoginMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserLoginMaxOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserLoginMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserLoginMinOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolNullableFilterSchema: z.ZodType<Prisma.BoolNullableFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const RolePermissionListRelationFilterSchema: z.ZodType<Prisma.RolePermissionListRelationFilter> = z.object({
  every: z.lazy(() => RolePermissionWhereInputSchema).optional(),
  some: z.lazy(() => RolePermissionWhereInputSchema).optional(),
  none: z.lazy(() => RolePermissionWhereInputSchema).optional()
}).strict();

export const RolePermissionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.RolePermissionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoleRoleNameHospitalIdCompoundUniqueInputSchema: z.ZodType<Prisma.RoleRoleNameHospitalIdCompoundUniqueInput> = z.object({
  roleName: z.string(),
  hospitalId: z.number()
}).strict();

export const RoleCountOrderByAggregateInputSchema: z.ZodType<Prisma.RoleCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roleName: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  isSuperAdmin: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoleAvgOrderByAggregateInputSchema: z.ZodType<Prisma.RoleAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoleMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RoleMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roleName: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  isSuperAdmin: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoleMinOrderByAggregateInputSchema: z.ZodType<Prisma.RoleMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roleName: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  isSuperAdmin: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoleSumOrderByAggregateInputSchema: z.ZodType<Prisma.RoleSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolNullableWithAggregatesFilterSchema: z.ZodType<Prisma.BoolNullableWithAggregatesFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolNullableFilterSchema).optional()
}).strict();

export const UserRoleUserIdRoleIdCompoundUniqueInputSchema: z.ZodType<Prisma.UserRoleUserIdRoleIdCompoundUniqueInput> = z.object({
  userId: z.string(),
  roleId: z.number()
}).strict();

export const UserRoleCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserRoleCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserRoleAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserRoleAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserRoleMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserRoleMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserRoleMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserRoleMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserRoleSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserRoleSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PermissionCountOrderByAggregateInputSchema: z.ZodType<Prisma.PermissionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  permissionName: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PermissionAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PermissionAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PermissionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PermissionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  permissionName: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PermissionMinOrderByAggregateInputSchema: z.ZodType<Prisma.PermissionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  permissionName: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PermissionSumOrderByAggregateInputSchema: z.ZodType<Prisma.PermissionSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PermissionRelationFilterSchema: z.ZodType<Prisma.PermissionRelationFilter> = z.object({
  is: z.lazy(() => PermissionWhereInputSchema).optional(),
  isNot: z.lazy(() => PermissionWhereInputSchema).optional()
}).strict();

export const RolePermissionCountOrderByAggregateInputSchema: z.ZodType<Prisma.RolePermissionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  permissionId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RolePermissionAvgOrderByAggregateInputSchema: z.ZodType<Prisma.RolePermissionAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  permissionId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RolePermissionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RolePermissionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  permissionId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RolePermissionMinOrderByAggregateInputSchema: z.ZodType<Prisma.RolePermissionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  permissionId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RolePermissionSumOrderByAggregateInputSchema: z.ZodType<Prisma.RolePermissionSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  permissionId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VendorCountOrderByAggregateInputSchema: z.ZodType<Prisma.VendorCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  gstNumber: z.lazy(() => SortOrderSchema).optional(),
  branchName: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VendorAvgOrderByAggregateInputSchema: z.ZodType<Prisma.VendorAvgOrderByAggregateInput> = z.object({
  hospitalId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VendorMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VendorMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  gstNumber: z.lazy(() => SortOrderSchema).optional(),
  branchName: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VendorMinOrderByAggregateInputSchema: z.ZodType<Prisma.VendorMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  gstNumber: z.lazy(() => SortOrderSchema).optional(),
  branchName: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VendorSumOrderByAggregateInputSchema: z.ZodType<Prisma.VendorSumOrderByAggregateInput> = z.object({
  hospitalId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const ProductCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProductCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sku: z.lazy(() => SortOrderSchema).optional(),
  hsnCode: z.lazy(() => SortOrderSchema).optional(),
  genericName: z.lazy(() => SortOrderSchema).optional(),
  brandName: z.lazy(() => SortOrderSchema).optional(),
  manufacturer: z.lazy(() => SortOrderSchema).optional(),
  dosageForm: z.lazy(() => SortOrderSchema).optional(),
  strength: z.lazy(() => SortOrderSchema).optional(),
  purchaseRate: z.lazy(() => SortOrderSchema).optional(),
  saleRate: z.lazy(() => SortOrderSchema).optional(),
  mrp: z.lazy(() => SortOrderSchema).optional(),
  maxDiscount: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProductAvgOrderByAggregateInput> = z.object({
  purchaseRate: z.lazy(() => SortOrderSchema).optional(),
  saleRate: z.lazy(() => SortOrderSchema).optional(),
  mrp: z.lazy(() => SortOrderSchema).optional(),
  maxDiscount: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProductMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sku: z.lazy(() => SortOrderSchema).optional(),
  hsnCode: z.lazy(() => SortOrderSchema).optional(),
  genericName: z.lazy(() => SortOrderSchema).optional(),
  brandName: z.lazy(() => SortOrderSchema).optional(),
  manufacturer: z.lazy(() => SortOrderSchema).optional(),
  dosageForm: z.lazy(() => SortOrderSchema).optional(),
  strength: z.lazy(() => SortOrderSchema).optional(),
  purchaseRate: z.lazy(() => SortOrderSchema).optional(),
  saleRate: z.lazy(() => SortOrderSchema).optional(),
  mrp: z.lazy(() => SortOrderSchema).optional(),
  maxDiscount: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProductMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sku: z.lazy(() => SortOrderSchema).optional(),
  hsnCode: z.lazy(() => SortOrderSchema).optional(),
  genericName: z.lazy(() => SortOrderSchema).optional(),
  brandName: z.lazy(() => SortOrderSchema).optional(),
  manufacturer: z.lazy(() => SortOrderSchema).optional(),
  dosageForm: z.lazy(() => SortOrderSchema).optional(),
  strength: z.lazy(() => SortOrderSchema).optional(),
  purchaseRate: z.lazy(() => SortOrderSchema).optional(),
  saleRate: z.lazy(() => SortOrderSchema).optional(),
  mrp: z.lazy(() => SortOrderSchema).optional(),
  maxDiscount: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProductSumOrderByAggregateInput> = z.object({
  purchaseRate: z.lazy(() => SortOrderSchema).optional(),
  saleRate: z.lazy(() => SortOrderSchema).optional(),
  mrp: z.lazy(() => SortOrderSchema).optional(),
  maxDiscount: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const ProductRelationFilterSchema: z.ZodType<Prisma.ProductRelationFilter> = z.object({
  is: z.lazy(() => ProductWhereInputSchema).optional(),
  isNot: z.lazy(() => ProductWhereInputSchema).optional()
}).strict();

export const ProductDepartmentProductIdDepartmentIdCompoundUniqueInputSchema: z.ZodType<Prisma.ProductDepartmentProductIdDepartmentIdCompoundUniqueInput> = z.object({
  productId: z.string(),
  departmentId: z.number()
}).strict();

export const ProductDepartmentCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProductDepartmentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  departmentId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductDepartmentAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProductDepartmentAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  departmentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductDepartmentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProductDepartmentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  departmentId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductDepartmentMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProductDepartmentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  departmentId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductDepartmentSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProductDepartmentSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  departmentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntentStatusRelationFilterSchema: z.ZodType<Prisma.IntentStatusRelationFilter> = z.object({
  is: z.lazy(() => IntentStatusWhereInputSchema).optional(),
  isNot: z.lazy(() => IntentStatusWhereInputSchema).optional()
}).strict();

export const IntentTrackCountOrderByAggregateInputSchema: z.ZodType<Prisma.IntentTrackCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  statusId: z.lazy(() => SortOrderSchema).optional(),
  color: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntentTrackAvgOrderByAggregateInputSchema: z.ZodType<Prisma.IntentTrackAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  statusId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntentTrackMaxOrderByAggregateInputSchema: z.ZodType<Prisma.IntentTrackMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  statusId: z.lazy(() => SortOrderSchema).optional(),
  color: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntentTrackMinOrderByAggregateInputSchema: z.ZodType<Prisma.IntentTrackMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  statusId: z.lazy(() => SortOrderSchema).optional(),
  color: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntentTrackSumOrderByAggregateInputSchema: z.ZodType<Prisma.IntentTrackSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  statusId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntentStatusCountOrderByAggregateInputSchema: z.ZodType<Prisma.IntentStatusCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntentStatusAvgOrderByAggregateInputSchema: z.ZodType<Prisma.IntentStatusAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntentStatusMaxOrderByAggregateInputSchema: z.ZodType<Prisma.IntentStatusMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntentStatusMinOrderByAggregateInputSchema: z.ZodType<Prisma.IntentStatusMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntentStatusSumOrderByAggregateInputSchema: z.ZodType<Prisma.IntentStatusSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntentTrackRelationFilterSchema: z.ZodType<Prisma.IntentTrackRelationFilter> = z.object({
  is: z.lazy(() => IntentTrackWhereInputSchema).optional(),
  isNot: z.lazy(() => IntentTrackWhereInputSchema).optional()
}).strict();

export const ProductIntentCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProductIntentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  intentId: z.lazy(() => SortOrderSchema).optional(),
  trackId: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductIntentAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProductIntentAvgOrderByAggregateInput> = z.object({
  intentId: z.lazy(() => SortOrderSchema).optional(),
  trackId: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductIntentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProductIntentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  intentId: z.lazy(() => SortOrderSchema).optional(),
  trackId: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductIntentMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProductIntentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  intentId: z.lazy(() => SortOrderSchema).optional(),
  trackId: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductIntentSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProductIntentSumOrderByAggregateInput> = z.object({
  intentId: z.lazy(() => SortOrderSchema).optional(),
  trackId: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumGenderFilterSchema: z.ZodType<Prisma.EnumGenderFilter> = z.object({
  equals: z.lazy(() => GenderSchema).optional(),
  in: z.lazy(() => GenderSchema).array().optional(),
  notIn: z.lazy(() => GenderSchema).array().optional(),
  not: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NestedEnumGenderFilterSchema) ]).optional(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const PatientCountOrderByAggregateInputSchema: z.ZodType<Prisma.PatientCountOrderByAggregateInput> = z.object({
  uhid: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  gender: z.lazy(() => SortOrderSchema).optional(),
  mobile: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  dob: z.lazy(() => SortOrderSchema).optional(),
  bornYear: z.lazy(() => SortOrderSchema).optional(),
  aadharNumber: z.lazy(() => SortOrderSchema).optional(),
  aadharName: z.lazy(() => SortOrderSchema).optional(),
  bloodGroup: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  pincode: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  fatherName: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PatientAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PatientAvgOrderByAggregateInput> = z.object({
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  bornYear: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PatientMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PatientMaxOrderByAggregateInput> = z.object({
  uhid: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  gender: z.lazy(() => SortOrderSchema).optional(),
  mobile: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  dob: z.lazy(() => SortOrderSchema).optional(),
  bornYear: z.lazy(() => SortOrderSchema).optional(),
  aadharNumber: z.lazy(() => SortOrderSchema).optional(),
  aadharName: z.lazy(() => SortOrderSchema).optional(),
  bloodGroup: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  pincode: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  fatherName: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PatientMinOrderByAggregateInputSchema: z.ZodType<Prisma.PatientMinOrderByAggregateInput> = z.object({
  uhid: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  gender: z.lazy(() => SortOrderSchema).optional(),
  mobile: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  dob: z.lazy(() => SortOrderSchema).optional(),
  bornYear: z.lazy(() => SortOrderSchema).optional(),
  aadharNumber: z.lazy(() => SortOrderSchema).optional(),
  aadharName: z.lazy(() => SortOrderSchema).optional(),
  bloodGroup: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  pincode: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  fatherName: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PatientSumOrderByAggregateInputSchema: z.ZodType<Prisma.PatientSumOrderByAggregateInput> = z.object({
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  bornYear: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumGenderWithAggregatesFilterSchema: z.ZodType<Prisma.EnumGenderWithAggregatesFilter> = z.object({
  equals: z.lazy(() => GenderSchema).optional(),
  in: z.lazy(() => GenderSchema).array().optional(),
  notIn: z.lazy(() => GenderSchema).array().optional(),
  not: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NestedEnumGenderWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumGenderFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumGenderFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const AssessmentNullableRelationFilterSchema: z.ZodType<Prisma.AssessmentNullableRelationFilter> = z.object({
  is: z.lazy(() => AssessmentWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => AssessmentWhereInputSchema).optional().nullable()
}).strict();

export const PatientRelationFilterSchema: z.ZodType<Prisma.PatientRelationFilter> = z.object({
  is: z.lazy(() => PatientWhereInputSchema).optional(),
  isNot: z.lazy(() => PatientWhereInputSchema).optional()
}).strict();

export const PatientVisitCountOrderByAggregateInputSchema: z.ZodType<Prisma.PatientVisitCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  uhid: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  departmentId: z.lazy(() => SortOrderSchema).optional(),
  doctorId: z.lazy(() => SortOrderSchema).optional(),
  checkInTime: z.lazy(() => SortOrderSchema).optional(),
  checkOutTime: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PatientVisitAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PatientVisitAvgOrderByAggregateInput> = z.object({
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  departmentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PatientVisitMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PatientVisitMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  uhid: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  departmentId: z.lazy(() => SortOrderSchema).optional(),
  doctorId: z.lazy(() => SortOrderSchema).optional(),
  checkInTime: z.lazy(() => SortOrderSchema).optional(),
  checkOutTime: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PatientVisitMinOrderByAggregateInputSchema: z.ZodType<Prisma.PatientVisitMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  uhid: z.lazy(() => SortOrderSchema).optional(),
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  departmentId: z.lazy(() => SortOrderSchema).optional(),
  doctorId: z.lazy(() => SortOrderSchema).optional(),
  checkInTime: z.lazy(() => SortOrderSchema).optional(),
  checkOutTime: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PatientVisitSumOrderByAggregateInputSchema: z.ZodType<Prisma.PatientVisitSumOrderByAggregateInput> = z.object({
  hospitalId: z.lazy(() => SortOrderSchema).optional(),
  departmentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const PatientVisitRelationFilterSchema: z.ZodType<Prisma.PatientVisitRelationFilter> = z.object({
  is: z.lazy(() => PatientVisitWhereInputSchema).optional(),
  isNot: z.lazy(() => PatientVisitWhereInputSchema).optional()
}).strict();

export const AssessmentCountOrderByAggregateInputSchema: z.ZodType<Prisma.AssessmentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  uhid: z.lazy(() => SortOrderSchema).optional(),
  doctorId: z.lazy(() => SortOrderSchema).optional(),
  patientVisitId: z.lazy(() => SortOrderSchema).optional(),
  complaint: z.lazy(() => SortOrderSchema).optional(),
  currentMedication: z.lazy(() => SortOrderSchema).optional(),
  pastMedicalHistory: z.lazy(() => SortOrderSchema).optional(),
  examination: z.lazy(() => SortOrderSchema).optional(),
  investigation: z.lazy(() => SortOrderSchema).optional(),
  procedureDone: z.lazy(() => SortOrderSchema).optional(),
  diagnosis: z.lazy(() => SortOrderSchema).optional(),
  treatmentGiven: z.lazy(() => SortOrderSchema).optional(),
  followUp: z.lazy(() => SortOrderSchema).optional(),
  followupInstruction: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AssessmentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AssessmentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  uhid: z.lazy(() => SortOrderSchema).optional(),
  doctorId: z.lazy(() => SortOrderSchema).optional(),
  patientVisitId: z.lazy(() => SortOrderSchema).optional(),
  complaint: z.lazy(() => SortOrderSchema).optional(),
  currentMedication: z.lazy(() => SortOrderSchema).optional(),
  pastMedicalHistory: z.lazy(() => SortOrderSchema).optional(),
  examination: z.lazy(() => SortOrderSchema).optional(),
  investigation: z.lazy(() => SortOrderSchema).optional(),
  procedureDone: z.lazy(() => SortOrderSchema).optional(),
  treatmentGiven: z.lazy(() => SortOrderSchema).optional(),
  followUp: z.lazy(() => SortOrderSchema).optional(),
  followupInstruction: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AssessmentMinOrderByAggregateInputSchema: z.ZodType<Prisma.AssessmentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  uhid: z.lazy(() => SortOrderSchema).optional(),
  doctorId: z.lazy(() => SortOrderSchema).optional(),
  patientVisitId: z.lazy(() => SortOrderSchema).optional(),
  complaint: z.lazy(() => SortOrderSchema).optional(),
  currentMedication: z.lazy(() => SortOrderSchema).optional(),
  pastMedicalHistory: z.lazy(() => SortOrderSchema).optional(),
  examination: z.lazy(() => SortOrderSchema).optional(),
  investigation: z.lazy(() => SortOrderSchema).optional(),
  procedureDone: z.lazy(() => SortOrderSchema).optional(),
  treatmentGiven: z.lazy(() => SortOrderSchema).optional(),
  followUp: z.lazy(() => SortOrderSchema).optional(),
  followupInstruction: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  updatedBy: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional()
}).strict();

export const DepartmentCreateNestedManyWithoutHospitalInputSchema: z.ZodType<Prisma.DepartmentCreateNestedManyWithoutHospitalInput> = z.object({
  create: z.union([ z.lazy(() => DepartmentCreateWithoutHospitalInputSchema),z.lazy(() => DepartmentCreateWithoutHospitalInputSchema).array(),z.lazy(() => DepartmentUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DepartmentCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => DepartmentCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DepartmentCreateManyHospitalInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const IntentTrackCreateNestedManyWithoutHospitalInputSchema: z.ZodType<Prisma.IntentTrackCreateNestedManyWithoutHospitalInput> = z.object({
  create: z.union([ z.lazy(() => IntentTrackCreateWithoutHospitalInputSchema),z.lazy(() => IntentTrackCreateWithoutHospitalInputSchema).array(),z.lazy(() => IntentTrackUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => IntentTrackUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => IntentTrackCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => IntentTrackCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => IntentTrackCreateManyHospitalInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => IntentTrackWhereUniqueInputSchema),z.lazy(() => IntentTrackWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PatientVisitCreateNestedManyWithoutHospitalInputSchema: z.ZodType<Prisma.PatientVisitCreateNestedManyWithoutHospitalInput> = z.object({
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutHospitalInputSchema),z.lazy(() => PatientVisitCreateWithoutHospitalInputSchema).array(),z.lazy(() => PatientVisitUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PatientVisitCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => PatientVisitCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PatientVisitCreateManyHospitalInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PermissionCreateNestedManyWithoutHospitalInputSchema: z.ZodType<Prisma.PermissionCreateNestedManyWithoutHospitalInput> = z.object({
  create: z.union([ z.lazy(() => PermissionCreateWithoutHospitalInputSchema),z.lazy(() => PermissionCreateWithoutHospitalInputSchema).array(),z.lazy(() => PermissionUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => PermissionUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PermissionCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => PermissionCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PermissionCreateManyHospitalInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PermissionWhereUniqueInputSchema),z.lazy(() => PermissionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProductCreateNestedManyWithoutHospitalInputSchema: z.ZodType<Prisma.ProductCreateNestedManyWithoutHospitalInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutHospitalInputSchema),z.lazy(() => ProductCreateWithoutHospitalInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => ProductUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => ProductCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyHospitalInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProductIntentCreateNestedManyWithoutHospitalInputSchema: z.ZodType<Prisma.ProductIntentCreateNestedManyWithoutHospitalInput> = z.object({
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutHospitalInputSchema),z.lazy(() => ProductIntentCreateWithoutHospitalInputSchema).array(),z.lazy(() => ProductIntentUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductIntentCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => ProductIntentCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductIntentCreateManyHospitalInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RoleCreateNestedManyWithoutHospitalInputSchema: z.ZodType<Prisma.RoleCreateNestedManyWithoutHospitalInput> = z.object({
  create: z.union([ z.lazy(() => RoleCreateWithoutHospitalInputSchema),z.lazy(() => RoleCreateWithoutHospitalInputSchema).array(),z.lazy(() => RoleUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => RoleUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoleCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => RoleCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoleCreateManyHospitalInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RoleWhereUniqueInputSchema),z.lazy(() => RoleWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedManyWithoutHospitalInputSchema: z.ZodType<Prisma.UserCreateNestedManyWithoutHospitalInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutHospitalInputSchema),z.lazy(() => UserCreateWithoutHospitalInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => UserUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => UserCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyHospitalInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const VendorCreateNestedManyWithoutHospitalInputSchema: z.ZodType<Prisma.VendorCreateNestedManyWithoutHospitalInput> = z.object({
  create: z.union([ z.lazy(() => VendorCreateWithoutHospitalInputSchema),z.lazy(() => VendorCreateWithoutHospitalInputSchema).array(),z.lazy(() => VendorUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => VendorUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VendorCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => VendorCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VendorCreateManyHospitalInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => VendorWhereUniqueInputSchema),z.lazy(() => VendorWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DepartmentUncheckedCreateNestedManyWithoutHospitalInputSchema: z.ZodType<Prisma.DepartmentUncheckedCreateNestedManyWithoutHospitalInput> = z.object({
  create: z.union([ z.lazy(() => DepartmentCreateWithoutHospitalInputSchema),z.lazy(() => DepartmentCreateWithoutHospitalInputSchema).array(),z.lazy(() => DepartmentUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DepartmentCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => DepartmentCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DepartmentCreateManyHospitalInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const IntentTrackUncheckedCreateNestedManyWithoutHospitalInputSchema: z.ZodType<Prisma.IntentTrackUncheckedCreateNestedManyWithoutHospitalInput> = z.object({
  create: z.union([ z.lazy(() => IntentTrackCreateWithoutHospitalInputSchema),z.lazy(() => IntentTrackCreateWithoutHospitalInputSchema).array(),z.lazy(() => IntentTrackUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => IntentTrackUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => IntentTrackCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => IntentTrackCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => IntentTrackCreateManyHospitalInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => IntentTrackWhereUniqueInputSchema),z.lazy(() => IntentTrackWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PatientVisitUncheckedCreateNestedManyWithoutHospitalInputSchema: z.ZodType<Prisma.PatientVisitUncheckedCreateNestedManyWithoutHospitalInput> = z.object({
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutHospitalInputSchema),z.lazy(() => PatientVisitCreateWithoutHospitalInputSchema).array(),z.lazy(() => PatientVisitUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PatientVisitCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => PatientVisitCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PatientVisitCreateManyHospitalInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PermissionUncheckedCreateNestedManyWithoutHospitalInputSchema: z.ZodType<Prisma.PermissionUncheckedCreateNestedManyWithoutHospitalInput> = z.object({
  create: z.union([ z.lazy(() => PermissionCreateWithoutHospitalInputSchema),z.lazy(() => PermissionCreateWithoutHospitalInputSchema).array(),z.lazy(() => PermissionUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => PermissionUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PermissionCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => PermissionCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PermissionCreateManyHospitalInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PermissionWhereUniqueInputSchema),z.lazy(() => PermissionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProductUncheckedCreateNestedManyWithoutHospitalInputSchema: z.ZodType<Prisma.ProductUncheckedCreateNestedManyWithoutHospitalInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutHospitalInputSchema),z.lazy(() => ProductCreateWithoutHospitalInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => ProductUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => ProductCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyHospitalInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProductIntentUncheckedCreateNestedManyWithoutHospitalInputSchema: z.ZodType<Prisma.ProductIntentUncheckedCreateNestedManyWithoutHospitalInput> = z.object({
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutHospitalInputSchema),z.lazy(() => ProductIntentCreateWithoutHospitalInputSchema).array(),z.lazy(() => ProductIntentUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductIntentCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => ProductIntentCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductIntentCreateManyHospitalInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RoleUncheckedCreateNestedManyWithoutHospitalInputSchema: z.ZodType<Prisma.RoleUncheckedCreateNestedManyWithoutHospitalInput> = z.object({
  create: z.union([ z.lazy(() => RoleCreateWithoutHospitalInputSchema),z.lazy(() => RoleCreateWithoutHospitalInputSchema).array(),z.lazy(() => RoleUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => RoleUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoleCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => RoleCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoleCreateManyHospitalInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RoleWhereUniqueInputSchema),z.lazy(() => RoleWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedCreateNestedManyWithoutHospitalInputSchema: z.ZodType<Prisma.UserUncheckedCreateNestedManyWithoutHospitalInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutHospitalInputSchema),z.lazy(() => UserCreateWithoutHospitalInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => UserUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => UserCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyHospitalInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const VendorUncheckedCreateNestedManyWithoutHospitalInputSchema: z.ZodType<Prisma.VendorUncheckedCreateNestedManyWithoutHospitalInput> = z.object({
  create: z.union([ z.lazy(() => VendorCreateWithoutHospitalInputSchema),z.lazy(() => VendorCreateWithoutHospitalInputSchema).array(),z.lazy(() => VendorUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => VendorUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VendorCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => VendorCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VendorCreateManyHospitalInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => VendorWhereUniqueInputSchema),z.lazy(() => VendorWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const DepartmentUpdateManyWithoutHospitalNestedInputSchema: z.ZodType<Prisma.DepartmentUpdateManyWithoutHospitalNestedInput> = z.object({
  create: z.union([ z.lazy(() => DepartmentCreateWithoutHospitalInputSchema),z.lazy(() => DepartmentCreateWithoutHospitalInputSchema).array(),z.lazy(() => DepartmentUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DepartmentCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => DepartmentCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DepartmentUpsertWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => DepartmentUpsertWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DepartmentCreateManyHospitalInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DepartmentUpdateWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => DepartmentUpdateWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DepartmentUpdateManyWithWhereWithoutHospitalInputSchema),z.lazy(() => DepartmentUpdateManyWithWhereWithoutHospitalInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DepartmentScalarWhereInputSchema),z.lazy(() => DepartmentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const IntentTrackUpdateManyWithoutHospitalNestedInputSchema: z.ZodType<Prisma.IntentTrackUpdateManyWithoutHospitalNestedInput> = z.object({
  create: z.union([ z.lazy(() => IntentTrackCreateWithoutHospitalInputSchema),z.lazy(() => IntentTrackCreateWithoutHospitalInputSchema).array(),z.lazy(() => IntentTrackUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => IntentTrackUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => IntentTrackCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => IntentTrackCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => IntentTrackUpsertWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => IntentTrackUpsertWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => IntentTrackCreateManyHospitalInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => IntentTrackWhereUniqueInputSchema),z.lazy(() => IntentTrackWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => IntentTrackWhereUniqueInputSchema),z.lazy(() => IntentTrackWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => IntentTrackWhereUniqueInputSchema),z.lazy(() => IntentTrackWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => IntentTrackWhereUniqueInputSchema),z.lazy(() => IntentTrackWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => IntentTrackUpdateWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => IntentTrackUpdateWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => IntentTrackUpdateManyWithWhereWithoutHospitalInputSchema),z.lazy(() => IntentTrackUpdateManyWithWhereWithoutHospitalInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => IntentTrackScalarWhereInputSchema),z.lazy(() => IntentTrackScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PatientVisitUpdateManyWithoutHospitalNestedInputSchema: z.ZodType<Prisma.PatientVisitUpdateManyWithoutHospitalNestedInput> = z.object({
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutHospitalInputSchema),z.lazy(() => PatientVisitCreateWithoutHospitalInputSchema).array(),z.lazy(() => PatientVisitUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PatientVisitCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => PatientVisitCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PatientVisitUpsertWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => PatientVisitUpsertWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PatientVisitCreateManyHospitalInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PatientVisitUpdateWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => PatientVisitUpdateWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PatientVisitUpdateManyWithWhereWithoutHospitalInputSchema),z.lazy(() => PatientVisitUpdateManyWithWhereWithoutHospitalInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PatientVisitScalarWhereInputSchema),z.lazy(() => PatientVisitScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PermissionUpdateManyWithoutHospitalNestedInputSchema: z.ZodType<Prisma.PermissionUpdateManyWithoutHospitalNestedInput> = z.object({
  create: z.union([ z.lazy(() => PermissionCreateWithoutHospitalInputSchema),z.lazy(() => PermissionCreateWithoutHospitalInputSchema).array(),z.lazy(() => PermissionUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => PermissionUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PermissionCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => PermissionCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PermissionUpsertWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => PermissionUpsertWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PermissionCreateManyHospitalInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PermissionWhereUniqueInputSchema),z.lazy(() => PermissionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PermissionWhereUniqueInputSchema),z.lazy(() => PermissionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PermissionWhereUniqueInputSchema),z.lazy(() => PermissionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PermissionWhereUniqueInputSchema),z.lazy(() => PermissionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PermissionUpdateWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => PermissionUpdateWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PermissionUpdateManyWithWhereWithoutHospitalInputSchema),z.lazy(() => PermissionUpdateManyWithWhereWithoutHospitalInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PermissionScalarWhereInputSchema),z.lazy(() => PermissionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProductUpdateManyWithoutHospitalNestedInputSchema: z.ZodType<Prisma.ProductUpdateManyWithoutHospitalNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutHospitalInputSchema),z.lazy(() => ProductCreateWithoutHospitalInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => ProductUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => ProductCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductUpsertWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => ProductUpsertWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyHospitalInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductUpdateWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => ProductUpdateWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductUpdateManyWithWhereWithoutHospitalInputSchema),z.lazy(() => ProductUpdateManyWithWhereWithoutHospitalInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProductIntentUpdateManyWithoutHospitalNestedInputSchema: z.ZodType<Prisma.ProductIntentUpdateManyWithoutHospitalNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutHospitalInputSchema),z.lazy(() => ProductIntentCreateWithoutHospitalInputSchema).array(),z.lazy(() => ProductIntentUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductIntentCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => ProductIntentCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductIntentUpsertWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => ProductIntentUpsertWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductIntentCreateManyHospitalInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductIntentUpdateWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => ProductIntentUpdateWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductIntentUpdateManyWithWhereWithoutHospitalInputSchema),z.lazy(() => ProductIntentUpdateManyWithWhereWithoutHospitalInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductIntentScalarWhereInputSchema),z.lazy(() => ProductIntentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RoleUpdateManyWithoutHospitalNestedInputSchema: z.ZodType<Prisma.RoleUpdateManyWithoutHospitalNestedInput> = z.object({
  create: z.union([ z.lazy(() => RoleCreateWithoutHospitalInputSchema),z.lazy(() => RoleCreateWithoutHospitalInputSchema).array(),z.lazy(() => RoleUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => RoleUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoleCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => RoleCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RoleUpsertWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => RoleUpsertWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoleCreateManyHospitalInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RoleWhereUniqueInputSchema),z.lazy(() => RoleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RoleWhereUniqueInputSchema),z.lazy(() => RoleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RoleWhereUniqueInputSchema),z.lazy(() => RoleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RoleWhereUniqueInputSchema),z.lazy(() => RoleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RoleUpdateWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => RoleUpdateWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RoleUpdateManyWithWhereWithoutHospitalInputSchema),z.lazy(() => RoleUpdateManyWithWhereWithoutHospitalInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RoleScalarWhereInputSchema),z.lazy(() => RoleScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateManyWithoutHospitalNestedInputSchema: z.ZodType<Prisma.UserUpdateManyWithoutHospitalNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutHospitalInputSchema),z.lazy(() => UserCreateWithoutHospitalInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => UserUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => UserCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyHospitalInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutHospitalInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutHospitalInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const VendorUpdateManyWithoutHospitalNestedInputSchema: z.ZodType<Prisma.VendorUpdateManyWithoutHospitalNestedInput> = z.object({
  create: z.union([ z.lazy(() => VendorCreateWithoutHospitalInputSchema),z.lazy(() => VendorCreateWithoutHospitalInputSchema).array(),z.lazy(() => VendorUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => VendorUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VendorCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => VendorCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => VendorUpsertWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => VendorUpsertWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VendorCreateManyHospitalInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => VendorWhereUniqueInputSchema),z.lazy(() => VendorWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => VendorWhereUniqueInputSchema),z.lazy(() => VendorWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => VendorWhereUniqueInputSchema),z.lazy(() => VendorWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => VendorWhereUniqueInputSchema),z.lazy(() => VendorWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => VendorUpdateWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => VendorUpdateWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => VendorUpdateManyWithWhereWithoutHospitalInputSchema),z.lazy(() => VendorUpdateManyWithWhereWithoutHospitalInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => VendorScalarWhereInputSchema),z.lazy(() => VendorScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const DepartmentUncheckedUpdateManyWithoutHospitalNestedInputSchema: z.ZodType<Prisma.DepartmentUncheckedUpdateManyWithoutHospitalNestedInput> = z.object({
  create: z.union([ z.lazy(() => DepartmentCreateWithoutHospitalInputSchema),z.lazy(() => DepartmentCreateWithoutHospitalInputSchema).array(),z.lazy(() => DepartmentUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DepartmentCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => DepartmentCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DepartmentUpsertWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => DepartmentUpsertWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DepartmentCreateManyHospitalInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DepartmentUpdateWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => DepartmentUpdateWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DepartmentUpdateManyWithWhereWithoutHospitalInputSchema),z.lazy(() => DepartmentUpdateManyWithWhereWithoutHospitalInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DepartmentScalarWhereInputSchema),z.lazy(() => DepartmentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const IntentTrackUncheckedUpdateManyWithoutHospitalNestedInputSchema: z.ZodType<Prisma.IntentTrackUncheckedUpdateManyWithoutHospitalNestedInput> = z.object({
  create: z.union([ z.lazy(() => IntentTrackCreateWithoutHospitalInputSchema),z.lazy(() => IntentTrackCreateWithoutHospitalInputSchema).array(),z.lazy(() => IntentTrackUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => IntentTrackUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => IntentTrackCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => IntentTrackCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => IntentTrackUpsertWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => IntentTrackUpsertWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => IntentTrackCreateManyHospitalInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => IntentTrackWhereUniqueInputSchema),z.lazy(() => IntentTrackWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => IntentTrackWhereUniqueInputSchema),z.lazy(() => IntentTrackWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => IntentTrackWhereUniqueInputSchema),z.lazy(() => IntentTrackWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => IntentTrackWhereUniqueInputSchema),z.lazy(() => IntentTrackWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => IntentTrackUpdateWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => IntentTrackUpdateWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => IntentTrackUpdateManyWithWhereWithoutHospitalInputSchema),z.lazy(() => IntentTrackUpdateManyWithWhereWithoutHospitalInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => IntentTrackScalarWhereInputSchema),z.lazy(() => IntentTrackScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PatientVisitUncheckedUpdateManyWithoutHospitalNestedInputSchema: z.ZodType<Prisma.PatientVisitUncheckedUpdateManyWithoutHospitalNestedInput> = z.object({
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutHospitalInputSchema),z.lazy(() => PatientVisitCreateWithoutHospitalInputSchema).array(),z.lazy(() => PatientVisitUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PatientVisitCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => PatientVisitCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PatientVisitUpsertWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => PatientVisitUpsertWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PatientVisitCreateManyHospitalInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PatientVisitUpdateWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => PatientVisitUpdateWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PatientVisitUpdateManyWithWhereWithoutHospitalInputSchema),z.lazy(() => PatientVisitUpdateManyWithWhereWithoutHospitalInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PatientVisitScalarWhereInputSchema),z.lazy(() => PatientVisitScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PermissionUncheckedUpdateManyWithoutHospitalNestedInputSchema: z.ZodType<Prisma.PermissionUncheckedUpdateManyWithoutHospitalNestedInput> = z.object({
  create: z.union([ z.lazy(() => PermissionCreateWithoutHospitalInputSchema),z.lazy(() => PermissionCreateWithoutHospitalInputSchema).array(),z.lazy(() => PermissionUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => PermissionUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PermissionCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => PermissionCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PermissionUpsertWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => PermissionUpsertWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PermissionCreateManyHospitalInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PermissionWhereUniqueInputSchema),z.lazy(() => PermissionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PermissionWhereUniqueInputSchema),z.lazy(() => PermissionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PermissionWhereUniqueInputSchema),z.lazy(() => PermissionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PermissionWhereUniqueInputSchema),z.lazy(() => PermissionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PermissionUpdateWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => PermissionUpdateWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PermissionUpdateManyWithWhereWithoutHospitalInputSchema),z.lazy(() => PermissionUpdateManyWithWhereWithoutHospitalInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PermissionScalarWhereInputSchema),z.lazy(() => PermissionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProductUncheckedUpdateManyWithoutHospitalNestedInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutHospitalNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutHospitalInputSchema),z.lazy(() => ProductCreateWithoutHospitalInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => ProductUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => ProductCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductUpsertWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => ProductUpsertWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyHospitalInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductUpdateWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => ProductUpdateWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductUpdateManyWithWhereWithoutHospitalInputSchema),z.lazy(() => ProductUpdateManyWithWhereWithoutHospitalInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProductIntentUncheckedUpdateManyWithoutHospitalNestedInputSchema: z.ZodType<Prisma.ProductIntentUncheckedUpdateManyWithoutHospitalNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutHospitalInputSchema),z.lazy(() => ProductIntentCreateWithoutHospitalInputSchema).array(),z.lazy(() => ProductIntentUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductIntentCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => ProductIntentCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductIntentUpsertWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => ProductIntentUpsertWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductIntentCreateManyHospitalInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductIntentUpdateWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => ProductIntentUpdateWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductIntentUpdateManyWithWhereWithoutHospitalInputSchema),z.lazy(() => ProductIntentUpdateManyWithWhereWithoutHospitalInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductIntentScalarWhereInputSchema),z.lazy(() => ProductIntentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RoleUncheckedUpdateManyWithoutHospitalNestedInputSchema: z.ZodType<Prisma.RoleUncheckedUpdateManyWithoutHospitalNestedInput> = z.object({
  create: z.union([ z.lazy(() => RoleCreateWithoutHospitalInputSchema),z.lazy(() => RoleCreateWithoutHospitalInputSchema).array(),z.lazy(() => RoleUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => RoleUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoleCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => RoleCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RoleUpsertWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => RoleUpsertWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoleCreateManyHospitalInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RoleWhereUniqueInputSchema),z.lazy(() => RoleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RoleWhereUniqueInputSchema),z.lazy(() => RoleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RoleWhereUniqueInputSchema),z.lazy(() => RoleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RoleWhereUniqueInputSchema),z.lazy(() => RoleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RoleUpdateWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => RoleUpdateWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RoleUpdateManyWithWhereWithoutHospitalInputSchema),z.lazy(() => RoleUpdateManyWithWhereWithoutHospitalInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RoleScalarWhereInputSchema),z.lazy(() => RoleScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedUpdateManyWithoutHospitalNestedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutHospitalNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutHospitalInputSchema),z.lazy(() => UserCreateWithoutHospitalInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => UserUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => UserCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyHospitalInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutHospitalInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutHospitalInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const VendorUncheckedUpdateManyWithoutHospitalNestedInputSchema: z.ZodType<Prisma.VendorUncheckedUpdateManyWithoutHospitalNestedInput> = z.object({
  create: z.union([ z.lazy(() => VendorCreateWithoutHospitalInputSchema),z.lazy(() => VendorCreateWithoutHospitalInputSchema).array(),z.lazy(() => VendorUncheckedCreateWithoutHospitalInputSchema),z.lazy(() => VendorUncheckedCreateWithoutHospitalInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VendorCreateOrConnectWithoutHospitalInputSchema),z.lazy(() => VendorCreateOrConnectWithoutHospitalInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => VendorUpsertWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => VendorUpsertWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VendorCreateManyHospitalInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => VendorWhereUniqueInputSchema),z.lazy(() => VendorWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => VendorWhereUniqueInputSchema),z.lazy(() => VendorWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => VendorWhereUniqueInputSchema),z.lazy(() => VendorWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => VendorWhereUniqueInputSchema),z.lazy(() => VendorWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => VendorUpdateWithWhereUniqueWithoutHospitalInputSchema),z.lazy(() => VendorUpdateWithWhereUniqueWithoutHospitalInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => VendorUpdateManyWithWhereWithoutHospitalInputSchema),z.lazy(() => VendorUpdateManyWithWhereWithoutHospitalInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => VendorScalarWhereInputSchema),z.lazy(() => VendorScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const HospitalCreateNestedOneWithoutDepartmentInputSchema: z.ZodType<Prisma.HospitalCreateNestedOneWithoutDepartmentInput> = z.object({
  create: z.union([ z.lazy(() => HospitalCreateWithoutDepartmentInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutDepartmentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HospitalCreateOrConnectWithoutDepartmentInputSchema).optional(),
  connect: z.lazy(() => HospitalWhereUniqueInputSchema).optional()
}).strict();

export const RoleCreateNestedOneWithoutDepartmentInputSchema: z.ZodType<Prisma.RoleCreateNestedOneWithoutDepartmentInput> = z.object({
  create: z.union([ z.lazy(() => RoleCreateWithoutDepartmentInputSchema),z.lazy(() => RoleUncheckedCreateWithoutDepartmentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoleCreateOrConnectWithoutDepartmentInputSchema).optional(),
  connect: z.lazy(() => RoleWhereUniqueInputSchema).optional()
}).strict();

export const PatientVisitCreateNestedManyWithoutDepartmentInputSchema: z.ZodType<Prisma.PatientVisitCreateNestedManyWithoutDepartmentInput> = z.object({
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutDepartmentInputSchema),z.lazy(() => PatientVisitCreateWithoutDepartmentInputSchema).array(),z.lazy(() => PatientVisitUncheckedCreateWithoutDepartmentInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutDepartmentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PatientVisitCreateOrConnectWithoutDepartmentInputSchema),z.lazy(() => PatientVisitCreateOrConnectWithoutDepartmentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PatientVisitCreateManyDepartmentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProductDepartmentCreateNestedManyWithoutDepartmentInputSchema: z.ZodType<Prisma.ProductDepartmentCreateNestedManyWithoutDepartmentInput> = z.object({
  create: z.union([ z.lazy(() => ProductDepartmentCreateWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentCreateWithoutDepartmentInputSchema).array(),z.lazy(() => ProductDepartmentUncheckedCreateWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentUncheckedCreateWithoutDepartmentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductDepartmentCreateOrConnectWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentCreateOrConnectWithoutDepartmentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductDepartmentCreateManyDepartmentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductDepartmentWhereUniqueInputSchema),z.lazy(() => ProductDepartmentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedManyWithoutDepartmentInputSchema: z.ZodType<Prisma.UserCreateNestedManyWithoutDepartmentInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutDepartmentInputSchema),z.lazy(() => UserCreateWithoutDepartmentInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutDepartmentInputSchema),z.lazy(() => UserUncheckedCreateWithoutDepartmentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutDepartmentInputSchema),z.lazy(() => UserCreateOrConnectWithoutDepartmentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyDepartmentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PatientVisitUncheckedCreateNestedManyWithoutDepartmentInputSchema: z.ZodType<Prisma.PatientVisitUncheckedCreateNestedManyWithoutDepartmentInput> = z.object({
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutDepartmentInputSchema),z.lazy(() => PatientVisitCreateWithoutDepartmentInputSchema).array(),z.lazy(() => PatientVisitUncheckedCreateWithoutDepartmentInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutDepartmentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PatientVisitCreateOrConnectWithoutDepartmentInputSchema),z.lazy(() => PatientVisitCreateOrConnectWithoutDepartmentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PatientVisitCreateManyDepartmentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProductDepartmentUncheckedCreateNestedManyWithoutDepartmentInputSchema: z.ZodType<Prisma.ProductDepartmentUncheckedCreateNestedManyWithoutDepartmentInput> = z.object({
  create: z.union([ z.lazy(() => ProductDepartmentCreateWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentCreateWithoutDepartmentInputSchema).array(),z.lazy(() => ProductDepartmentUncheckedCreateWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentUncheckedCreateWithoutDepartmentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductDepartmentCreateOrConnectWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentCreateOrConnectWithoutDepartmentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductDepartmentCreateManyDepartmentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductDepartmentWhereUniqueInputSchema),z.lazy(() => ProductDepartmentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedCreateNestedManyWithoutDepartmentInputSchema: z.ZodType<Prisma.UserUncheckedCreateNestedManyWithoutDepartmentInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutDepartmentInputSchema),z.lazy(() => UserCreateWithoutDepartmentInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutDepartmentInputSchema),z.lazy(() => UserUncheckedCreateWithoutDepartmentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutDepartmentInputSchema),z.lazy(() => UserCreateOrConnectWithoutDepartmentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyDepartmentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const HospitalUpdateOneRequiredWithoutDepartmentNestedInputSchema: z.ZodType<Prisma.HospitalUpdateOneRequiredWithoutDepartmentNestedInput> = z.object({
  create: z.union([ z.lazy(() => HospitalCreateWithoutDepartmentInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutDepartmentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HospitalCreateOrConnectWithoutDepartmentInputSchema).optional(),
  upsert: z.lazy(() => HospitalUpsertWithoutDepartmentInputSchema).optional(),
  connect: z.lazy(() => HospitalWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => HospitalUpdateToOneWithWhereWithoutDepartmentInputSchema),z.lazy(() => HospitalUpdateWithoutDepartmentInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutDepartmentInputSchema) ]).optional(),
}).strict();

export const RoleUpdateOneRequiredWithoutDepartmentNestedInputSchema: z.ZodType<Prisma.RoleUpdateOneRequiredWithoutDepartmentNestedInput> = z.object({
  create: z.union([ z.lazy(() => RoleCreateWithoutDepartmentInputSchema),z.lazy(() => RoleUncheckedCreateWithoutDepartmentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoleCreateOrConnectWithoutDepartmentInputSchema).optional(),
  upsert: z.lazy(() => RoleUpsertWithoutDepartmentInputSchema).optional(),
  connect: z.lazy(() => RoleWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RoleUpdateToOneWithWhereWithoutDepartmentInputSchema),z.lazy(() => RoleUpdateWithoutDepartmentInputSchema),z.lazy(() => RoleUncheckedUpdateWithoutDepartmentInputSchema) ]).optional(),
}).strict();

export const PatientVisitUpdateManyWithoutDepartmentNestedInputSchema: z.ZodType<Prisma.PatientVisitUpdateManyWithoutDepartmentNestedInput> = z.object({
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutDepartmentInputSchema),z.lazy(() => PatientVisitCreateWithoutDepartmentInputSchema).array(),z.lazy(() => PatientVisitUncheckedCreateWithoutDepartmentInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutDepartmentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PatientVisitCreateOrConnectWithoutDepartmentInputSchema),z.lazy(() => PatientVisitCreateOrConnectWithoutDepartmentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PatientVisitUpsertWithWhereUniqueWithoutDepartmentInputSchema),z.lazy(() => PatientVisitUpsertWithWhereUniqueWithoutDepartmentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PatientVisitCreateManyDepartmentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PatientVisitUpdateWithWhereUniqueWithoutDepartmentInputSchema),z.lazy(() => PatientVisitUpdateWithWhereUniqueWithoutDepartmentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PatientVisitUpdateManyWithWhereWithoutDepartmentInputSchema),z.lazy(() => PatientVisitUpdateManyWithWhereWithoutDepartmentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PatientVisitScalarWhereInputSchema),z.lazy(() => PatientVisitScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProductDepartmentUpdateManyWithoutDepartmentNestedInputSchema: z.ZodType<Prisma.ProductDepartmentUpdateManyWithoutDepartmentNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductDepartmentCreateWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentCreateWithoutDepartmentInputSchema).array(),z.lazy(() => ProductDepartmentUncheckedCreateWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentUncheckedCreateWithoutDepartmentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductDepartmentCreateOrConnectWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentCreateOrConnectWithoutDepartmentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductDepartmentUpsertWithWhereUniqueWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentUpsertWithWhereUniqueWithoutDepartmentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductDepartmentCreateManyDepartmentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductDepartmentWhereUniqueInputSchema),z.lazy(() => ProductDepartmentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductDepartmentWhereUniqueInputSchema),z.lazy(() => ProductDepartmentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductDepartmentWhereUniqueInputSchema),z.lazy(() => ProductDepartmentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductDepartmentWhereUniqueInputSchema),z.lazy(() => ProductDepartmentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductDepartmentUpdateWithWhereUniqueWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentUpdateWithWhereUniqueWithoutDepartmentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductDepartmentUpdateManyWithWhereWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentUpdateManyWithWhereWithoutDepartmentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductDepartmentScalarWhereInputSchema),z.lazy(() => ProductDepartmentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateManyWithoutDepartmentNestedInputSchema: z.ZodType<Prisma.UserUpdateManyWithoutDepartmentNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutDepartmentInputSchema),z.lazy(() => UserCreateWithoutDepartmentInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutDepartmentInputSchema),z.lazy(() => UserUncheckedCreateWithoutDepartmentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutDepartmentInputSchema),z.lazy(() => UserCreateOrConnectWithoutDepartmentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutDepartmentInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutDepartmentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyDepartmentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutDepartmentInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutDepartmentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutDepartmentInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutDepartmentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PatientVisitUncheckedUpdateManyWithoutDepartmentNestedInputSchema: z.ZodType<Prisma.PatientVisitUncheckedUpdateManyWithoutDepartmentNestedInput> = z.object({
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutDepartmentInputSchema),z.lazy(() => PatientVisitCreateWithoutDepartmentInputSchema).array(),z.lazy(() => PatientVisitUncheckedCreateWithoutDepartmentInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutDepartmentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PatientVisitCreateOrConnectWithoutDepartmentInputSchema),z.lazy(() => PatientVisitCreateOrConnectWithoutDepartmentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PatientVisitUpsertWithWhereUniqueWithoutDepartmentInputSchema),z.lazy(() => PatientVisitUpsertWithWhereUniqueWithoutDepartmentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PatientVisitCreateManyDepartmentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PatientVisitUpdateWithWhereUniqueWithoutDepartmentInputSchema),z.lazy(() => PatientVisitUpdateWithWhereUniqueWithoutDepartmentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PatientVisitUpdateManyWithWhereWithoutDepartmentInputSchema),z.lazy(() => PatientVisitUpdateManyWithWhereWithoutDepartmentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PatientVisitScalarWhereInputSchema),z.lazy(() => PatientVisitScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProductDepartmentUncheckedUpdateManyWithoutDepartmentNestedInputSchema: z.ZodType<Prisma.ProductDepartmentUncheckedUpdateManyWithoutDepartmentNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductDepartmentCreateWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentCreateWithoutDepartmentInputSchema).array(),z.lazy(() => ProductDepartmentUncheckedCreateWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentUncheckedCreateWithoutDepartmentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductDepartmentCreateOrConnectWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentCreateOrConnectWithoutDepartmentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductDepartmentUpsertWithWhereUniqueWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentUpsertWithWhereUniqueWithoutDepartmentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductDepartmentCreateManyDepartmentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductDepartmentWhereUniqueInputSchema),z.lazy(() => ProductDepartmentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductDepartmentWhereUniqueInputSchema),z.lazy(() => ProductDepartmentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductDepartmentWhereUniqueInputSchema),z.lazy(() => ProductDepartmentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductDepartmentWhereUniqueInputSchema),z.lazy(() => ProductDepartmentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductDepartmentUpdateWithWhereUniqueWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentUpdateWithWhereUniqueWithoutDepartmentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductDepartmentUpdateManyWithWhereWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentUpdateManyWithWhereWithoutDepartmentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductDepartmentScalarWhereInputSchema),z.lazy(() => ProductDepartmentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedUpdateManyWithoutDepartmentNestedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutDepartmentNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutDepartmentInputSchema),z.lazy(() => UserCreateWithoutDepartmentInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutDepartmentInputSchema),z.lazy(() => UserUncheckedCreateWithoutDepartmentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutDepartmentInputSchema),z.lazy(() => UserCreateOrConnectWithoutDepartmentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutDepartmentInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutDepartmentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyDepartmentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutDepartmentInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutDepartmentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutDepartmentInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutDepartmentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AssessmentCreateNestedManyWithoutDoctorInputSchema: z.ZodType<Prisma.AssessmentCreateNestedManyWithoutDoctorInput> = z.object({
  create: z.union([ z.lazy(() => AssessmentCreateWithoutDoctorInputSchema),z.lazy(() => AssessmentCreateWithoutDoctorInputSchema).array(),z.lazy(() => AssessmentUncheckedCreateWithoutDoctorInputSchema),z.lazy(() => AssessmentUncheckedCreateWithoutDoctorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AssessmentCreateOrConnectWithoutDoctorInputSchema),z.lazy(() => AssessmentCreateOrConnectWithoutDoctorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AssessmentCreateManyDoctorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AssessmentWhereUniqueInputSchema),z.lazy(() => AssessmentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PatientVisitCreateNestedManyWithoutDoctorInputSchema: z.ZodType<Prisma.PatientVisitCreateNestedManyWithoutDoctorInput> = z.object({
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutDoctorInputSchema),z.lazy(() => PatientVisitCreateWithoutDoctorInputSchema).array(),z.lazy(() => PatientVisitUncheckedCreateWithoutDoctorInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutDoctorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PatientVisitCreateOrConnectWithoutDoctorInputSchema),z.lazy(() => PatientVisitCreateOrConnectWithoutDoctorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PatientVisitCreateManyDoctorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DepartmentCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.DepartmentCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => DepartmentCreateWithoutUserInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DepartmentCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => DepartmentWhereUniqueInputSchema).optional()
}).strict();

export const HospitalCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.HospitalCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => HospitalCreateWithoutUserInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HospitalCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => HospitalWhereUniqueInputSchema).optional()
}).strict();

export const UserLoginCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.UserLoginCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => UserLoginCreateWithoutUserInputSchema),z.lazy(() => UserLoginUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserLoginCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => UserLoginWhereUniqueInputSchema).optional()
}).strict();

export const UserRoleCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.UserRoleCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => UserRoleCreateWithoutUserInputSchema),z.lazy(() => UserRoleCreateWithoutUserInputSchema).array(),z.lazy(() => UserRoleUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserRoleUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRoleCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserRoleCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRoleCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema),z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AssessmentUncheckedCreateNestedManyWithoutDoctorInputSchema: z.ZodType<Prisma.AssessmentUncheckedCreateNestedManyWithoutDoctorInput> = z.object({
  create: z.union([ z.lazy(() => AssessmentCreateWithoutDoctorInputSchema),z.lazy(() => AssessmentCreateWithoutDoctorInputSchema).array(),z.lazy(() => AssessmentUncheckedCreateWithoutDoctorInputSchema),z.lazy(() => AssessmentUncheckedCreateWithoutDoctorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AssessmentCreateOrConnectWithoutDoctorInputSchema),z.lazy(() => AssessmentCreateOrConnectWithoutDoctorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AssessmentCreateManyDoctorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AssessmentWhereUniqueInputSchema),z.lazy(() => AssessmentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PatientVisitUncheckedCreateNestedManyWithoutDoctorInputSchema: z.ZodType<Prisma.PatientVisitUncheckedCreateNestedManyWithoutDoctorInput> = z.object({
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutDoctorInputSchema),z.lazy(() => PatientVisitCreateWithoutDoctorInputSchema).array(),z.lazy(() => PatientVisitUncheckedCreateWithoutDoctorInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutDoctorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PatientVisitCreateOrConnectWithoutDoctorInputSchema),z.lazy(() => PatientVisitCreateOrConnectWithoutDoctorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PatientVisitCreateManyDoctorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserLoginUncheckedCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.UserLoginUncheckedCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => UserLoginCreateWithoutUserInputSchema),z.lazy(() => UserLoginUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserLoginCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => UserLoginWhereUniqueInputSchema).optional()
}).strict();

export const UserRoleUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.UserRoleUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => UserRoleCreateWithoutUserInputSchema),z.lazy(() => UserRoleCreateWithoutUserInputSchema).array(),z.lazy(() => UserRoleUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserRoleUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRoleCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserRoleCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRoleCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema),z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const AssessmentUpdateManyWithoutDoctorNestedInputSchema: z.ZodType<Prisma.AssessmentUpdateManyWithoutDoctorNestedInput> = z.object({
  create: z.union([ z.lazy(() => AssessmentCreateWithoutDoctorInputSchema),z.lazy(() => AssessmentCreateWithoutDoctorInputSchema).array(),z.lazy(() => AssessmentUncheckedCreateWithoutDoctorInputSchema),z.lazy(() => AssessmentUncheckedCreateWithoutDoctorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AssessmentCreateOrConnectWithoutDoctorInputSchema),z.lazy(() => AssessmentCreateOrConnectWithoutDoctorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AssessmentUpsertWithWhereUniqueWithoutDoctorInputSchema),z.lazy(() => AssessmentUpsertWithWhereUniqueWithoutDoctorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AssessmentCreateManyDoctorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AssessmentWhereUniqueInputSchema),z.lazy(() => AssessmentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AssessmentWhereUniqueInputSchema),z.lazy(() => AssessmentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AssessmentWhereUniqueInputSchema),z.lazy(() => AssessmentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AssessmentWhereUniqueInputSchema),z.lazy(() => AssessmentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AssessmentUpdateWithWhereUniqueWithoutDoctorInputSchema),z.lazy(() => AssessmentUpdateWithWhereUniqueWithoutDoctorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AssessmentUpdateManyWithWhereWithoutDoctorInputSchema),z.lazy(() => AssessmentUpdateManyWithWhereWithoutDoctorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AssessmentScalarWhereInputSchema),z.lazy(() => AssessmentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PatientVisitUpdateManyWithoutDoctorNestedInputSchema: z.ZodType<Prisma.PatientVisitUpdateManyWithoutDoctorNestedInput> = z.object({
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutDoctorInputSchema),z.lazy(() => PatientVisitCreateWithoutDoctorInputSchema).array(),z.lazy(() => PatientVisitUncheckedCreateWithoutDoctorInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutDoctorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PatientVisitCreateOrConnectWithoutDoctorInputSchema),z.lazy(() => PatientVisitCreateOrConnectWithoutDoctorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PatientVisitUpsertWithWhereUniqueWithoutDoctorInputSchema),z.lazy(() => PatientVisitUpsertWithWhereUniqueWithoutDoctorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PatientVisitCreateManyDoctorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PatientVisitUpdateWithWhereUniqueWithoutDoctorInputSchema),z.lazy(() => PatientVisitUpdateWithWhereUniqueWithoutDoctorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PatientVisitUpdateManyWithWhereWithoutDoctorInputSchema),z.lazy(() => PatientVisitUpdateManyWithWhereWithoutDoctorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PatientVisitScalarWhereInputSchema),z.lazy(() => PatientVisitScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DepartmentUpdateOneRequiredWithoutUserNestedInputSchema: z.ZodType<Prisma.DepartmentUpdateOneRequiredWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => DepartmentCreateWithoutUserInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DepartmentCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => DepartmentUpsertWithoutUserInputSchema).optional(),
  connect: z.lazy(() => DepartmentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DepartmentUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => DepartmentUpdateWithoutUserInputSchema),z.lazy(() => DepartmentUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const HospitalUpdateOneRequiredWithoutUserNestedInputSchema: z.ZodType<Prisma.HospitalUpdateOneRequiredWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => HospitalCreateWithoutUserInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HospitalCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => HospitalUpsertWithoutUserInputSchema).optional(),
  connect: z.lazy(() => HospitalWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => HospitalUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => HospitalUpdateWithoutUserInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const UserLoginUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.UserLoginUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserLoginCreateWithoutUserInputSchema),z.lazy(() => UserLoginUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserLoginCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => UserLoginUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserLoginWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserLoginWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserLoginWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserLoginUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => UserLoginUpdateWithoutUserInputSchema),z.lazy(() => UserLoginUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const UserRoleUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.UserRoleUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserRoleCreateWithoutUserInputSchema),z.lazy(() => UserRoleCreateWithoutUserInputSchema).array(),z.lazy(() => UserRoleUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserRoleUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRoleCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserRoleCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserRoleUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserRoleUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRoleCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema),z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema),z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema),z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema),z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserRoleUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserRoleUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserRoleUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => UserRoleUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserRoleScalarWhereInputSchema),z.lazy(() => UserRoleScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AssessmentUncheckedUpdateManyWithoutDoctorNestedInputSchema: z.ZodType<Prisma.AssessmentUncheckedUpdateManyWithoutDoctorNestedInput> = z.object({
  create: z.union([ z.lazy(() => AssessmentCreateWithoutDoctorInputSchema),z.lazy(() => AssessmentCreateWithoutDoctorInputSchema).array(),z.lazy(() => AssessmentUncheckedCreateWithoutDoctorInputSchema),z.lazy(() => AssessmentUncheckedCreateWithoutDoctorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AssessmentCreateOrConnectWithoutDoctorInputSchema),z.lazy(() => AssessmentCreateOrConnectWithoutDoctorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AssessmentUpsertWithWhereUniqueWithoutDoctorInputSchema),z.lazy(() => AssessmentUpsertWithWhereUniqueWithoutDoctorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AssessmentCreateManyDoctorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AssessmentWhereUniqueInputSchema),z.lazy(() => AssessmentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AssessmentWhereUniqueInputSchema),z.lazy(() => AssessmentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AssessmentWhereUniqueInputSchema),z.lazy(() => AssessmentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AssessmentWhereUniqueInputSchema),z.lazy(() => AssessmentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AssessmentUpdateWithWhereUniqueWithoutDoctorInputSchema),z.lazy(() => AssessmentUpdateWithWhereUniqueWithoutDoctorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AssessmentUpdateManyWithWhereWithoutDoctorInputSchema),z.lazy(() => AssessmentUpdateManyWithWhereWithoutDoctorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AssessmentScalarWhereInputSchema),z.lazy(() => AssessmentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PatientVisitUncheckedUpdateManyWithoutDoctorNestedInputSchema: z.ZodType<Prisma.PatientVisitUncheckedUpdateManyWithoutDoctorNestedInput> = z.object({
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutDoctorInputSchema),z.lazy(() => PatientVisitCreateWithoutDoctorInputSchema).array(),z.lazy(() => PatientVisitUncheckedCreateWithoutDoctorInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutDoctorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PatientVisitCreateOrConnectWithoutDoctorInputSchema),z.lazy(() => PatientVisitCreateOrConnectWithoutDoctorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PatientVisitUpsertWithWhereUniqueWithoutDoctorInputSchema),z.lazy(() => PatientVisitUpsertWithWhereUniqueWithoutDoctorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PatientVisitCreateManyDoctorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PatientVisitUpdateWithWhereUniqueWithoutDoctorInputSchema),z.lazy(() => PatientVisitUpdateWithWhereUniqueWithoutDoctorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PatientVisitUpdateManyWithWhereWithoutDoctorInputSchema),z.lazy(() => PatientVisitUpdateManyWithWhereWithoutDoctorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PatientVisitScalarWhereInputSchema),z.lazy(() => PatientVisitScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserLoginUncheckedUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.UserLoginUncheckedUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserLoginCreateWithoutUserInputSchema),z.lazy(() => UserLoginUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserLoginCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => UserLoginUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserLoginWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserLoginWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserLoginWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserLoginUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => UserLoginUpdateWithoutUserInputSchema),z.lazy(() => UserLoginUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const UserRoleUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.UserRoleUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserRoleCreateWithoutUserInputSchema),z.lazy(() => UserRoleCreateWithoutUserInputSchema).array(),z.lazy(() => UserRoleUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserRoleUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRoleCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserRoleCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserRoleUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserRoleUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRoleCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema),z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema),z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema),z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema),z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserRoleUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserRoleUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserRoleUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => UserRoleUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserRoleScalarWhereInputSchema),z.lazy(() => UserRoleScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutUserLoginInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutUserLoginInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutUserLoginInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserLoginInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutUserLoginInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutUserLoginNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutUserLoginNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutUserLoginInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserLoginInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutUserLoginInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutUserLoginInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutUserLoginInputSchema),z.lazy(() => UserUpdateWithoutUserLoginInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUserLoginInputSchema) ]).optional(),
}).strict();

export const DepartmentCreateNestedManyWithoutRoleInputSchema: z.ZodType<Prisma.DepartmentCreateNestedManyWithoutRoleInput> = z.object({
  create: z.union([ z.lazy(() => DepartmentCreateWithoutRoleInputSchema),z.lazy(() => DepartmentCreateWithoutRoleInputSchema).array(),z.lazy(() => DepartmentUncheckedCreateWithoutRoleInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DepartmentCreateOrConnectWithoutRoleInputSchema),z.lazy(() => DepartmentCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DepartmentCreateManyRoleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const HospitalCreateNestedOneWithoutRoleInputSchema: z.ZodType<Prisma.HospitalCreateNestedOneWithoutRoleInput> = z.object({
  create: z.union([ z.lazy(() => HospitalCreateWithoutRoleInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutRoleInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HospitalCreateOrConnectWithoutRoleInputSchema).optional(),
  connect: z.lazy(() => HospitalWhereUniqueInputSchema).optional()
}).strict();

export const RolePermissionCreateNestedManyWithoutRoleInputSchema: z.ZodType<Prisma.RolePermissionCreateNestedManyWithoutRoleInput> = z.object({
  create: z.union([ z.lazy(() => RolePermissionCreateWithoutRoleInputSchema),z.lazy(() => RolePermissionCreateWithoutRoleInputSchema).array(),z.lazy(() => RolePermissionUncheckedCreateWithoutRoleInputSchema),z.lazy(() => RolePermissionUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RolePermissionCreateOrConnectWithoutRoleInputSchema),z.lazy(() => RolePermissionCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RolePermissionCreateManyRoleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RolePermissionWhereUniqueInputSchema),z.lazy(() => RolePermissionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserRoleCreateNestedManyWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleCreateNestedManyWithoutRoleInput> = z.object({
  create: z.union([ z.lazy(() => UserRoleCreateWithoutRoleInputSchema),z.lazy(() => UserRoleCreateWithoutRoleInputSchema).array(),z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputSchema),z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRoleCreateOrConnectWithoutRoleInputSchema),z.lazy(() => UserRoleCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRoleCreateManyRoleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema),z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DepartmentUncheckedCreateNestedManyWithoutRoleInputSchema: z.ZodType<Prisma.DepartmentUncheckedCreateNestedManyWithoutRoleInput> = z.object({
  create: z.union([ z.lazy(() => DepartmentCreateWithoutRoleInputSchema),z.lazy(() => DepartmentCreateWithoutRoleInputSchema).array(),z.lazy(() => DepartmentUncheckedCreateWithoutRoleInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DepartmentCreateOrConnectWithoutRoleInputSchema),z.lazy(() => DepartmentCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DepartmentCreateManyRoleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RolePermissionUncheckedCreateNestedManyWithoutRoleInputSchema: z.ZodType<Prisma.RolePermissionUncheckedCreateNestedManyWithoutRoleInput> = z.object({
  create: z.union([ z.lazy(() => RolePermissionCreateWithoutRoleInputSchema),z.lazy(() => RolePermissionCreateWithoutRoleInputSchema).array(),z.lazy(() => RolePermissionUncheckedCreateWithoutRoleInputSchema),z.lazy(() => RolePermissionUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RolePermissionCreateOrConnectWithoutRoleInputSchema),z.lazy(() => RolePermissionCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RolePermissionCreateManyRoleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RolePermissionWhereUniqueInputSchema),z.lazy(() => RolePermissionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserRoleUncheckedCreateNestedManyWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleUncheckedCreateNestedManyWithoutRoleInput> = z.object({
  create: z.union([ z.lazy(() => UserRoleCreateWithoutRoleInputSchema),z.lazy(() => UserRoleCreateWithoutRoleInputSchema).array(),z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputSchema),z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRoleCreateOrConnectWithoutRoleInputSchema),z.lazy(() => UserRoleCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRoleCreateManyRoleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema),z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableBoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableBoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional().nullable()
}).strict();

export const DepartmentUpdateManyWithoutRoleNestedInputSchema: z.ZodType<Prisma.DepartmentUpdateManyWithoutRoleNestedInput> = z.object({
  create: z.union([ z.lazy(() => DepartmentCreateWithoutRoleInputSchema),z.lazy(() => DepartmentCreateWithoutRoleInputSchema).array(),z.lazy(() => DepartmentUncheckedCreateWithoutRoleInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DepartmentCreateOrConnectWithoutRoleInputSchema),z.lazy(() => DepartmentCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DepartmentUpsertWithWhereUniqueWithoutRoleInputSchema),z.lazy(() => DepartmentUpsertWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DepartmentCreateManyRoleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DepartmentUpdateWithWhereUniqueWithoutRoleInputSchema),z.lazy(() => DepartmentUpdateWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DepartmentUpdateManyWithWhereWithoutRoleInputSchema),z.lazy(() => DepartmentUpdateManyWithWhereWithoutRoleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DepartmentScalarWhereInputSchema),z.lazy(() => DepartmentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const HospitalUpdateOneRequiredWithoutRoleNestedInputSchema: z.ZodType<Prisma.HospitalUpdateOneRequiredWithoutRoleNestedInput> = z.object({
  create: z.union([ z.lazy(() => HospitalCreateWithoutRoleInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutRoleInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HospitalCreateOrConnectWithoutRoleInputSchema).optional(),
  upsert: z.lazy(() => HospitalUpsertWithoutRoleInputSchema).optional(),
  connect: z.lazy(() => HospitalWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => HospitalUpdateToOneWithWhereWithoutRoleInputSchema),z.lazy(() => HospitalUpdateWithoutRoleInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutRoleInputSchema) ]).optional(),
}).strict();

export const RolePermissionUpdateManyWithoutRoleNestedInputSchema: z.ZodType<Prisma.RolePermissionUpdateManyWithoutRoleNestedInput> = z.object({
  create: z.union([ z.lazy(() => RolePermissionCreateWithoutRoleInputSchema),z.lazy(() => RolePermissionCreateWithoutRoleInputSchema).array(),z.lazy(() => RolePermissionUncheckedCreateWithoutRoleInputSchema),z.lazy(() => RolePermissionUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RolePermissionCreateOrConnectWithoutRoleInputSchema),z.lazy(() => RolePermissionCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RolePermissionUpsertWithWhereUniqueWithoutRoleInputSchema),z.lazy(() => RolePermissionUpsertWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RolePermissionCreateManyRoleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RolePermissionWhereUniqueInputSchema),z.lazy(() => RolePermissionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RolePermissionWhereUniqueInputSchema),z.lazy(() => RolePermissionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RolePermissionWhereUniqueInputSchema),z.lazy(() => RolePermissionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RolePermissionWhereUniqueInputSchema),z.lazy(() => RolePermissionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RolePermissionUpdateWithWhereUniqueWithoutRoleInputSchema),z.lazy(() => RolePermissionUpdateWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RolePermissionUpdateManyWithWhereWithoutRoleInputSchema),z.lazy(() => RolePermissionUpdateManyWithWhereWithoutRoleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RolePermissionScalarWhereInputSchema),z.lazy(() => RolePermissionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserRoleUpdateManyWithoutRoleNestedInputSchema: z.ZodType<Prisma.UserRoleUpdateManyWithoutRoleNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserRoleCreateWithoutRoleInputSchema),z.lazy(() => UserRoleCreateWithoutRoleInputSchema).array(),z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputSchema),z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRoleCreateOrConnectWithoutRoleInputSchema),z.lazy(() => UserRoleCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserRoleUpsertWithWhereUniqueWithoutRoleInputSchema),z.lazy(() => UserRoleUpsertWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRoleCreateManyRoleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema),z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema),z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema),z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema),z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserRoleUpdateWithWhereUniqueWithoutRoleInputSchema),z.lazy(() => UserRoleUpdateWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserRoleUpdateManyWithWhereWithoutRoleInputSchema),z.lazy(() => UserRoleUpdateManyWithWhereWithoutRoleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserRoleScalarWhereInputSchema),z.lazy(() => UserRoleScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DepartmentUncheckedUpdateManyWithoutRoleNestedInputSchema: z.ZodType<Prisma.DepartmentUncheckedUpdateManyWithoutRoleNestedInput> = z.object({
  create: z.union([ z.lazy(() => DepartmentCreateWithoutRoleInputSchema),z.lazy(() => DepartmentCreateWithoutRoleInputSchema).array(),z.lazy(() => DepartmentUncheckedCreateWithoutRoleInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DepartmentCreateOrConnectWithoutRoleInputSchema),z.lazy(() => DepartmentCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DepartmentUpsertWithWhereUniqueWithoutRoleInputSchema),z.lazy(() => DepartmentUpsertWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DepartmentCreateManyRoleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DepartmentUpdateWithWhereUniqueWithoutRoleInputSchema),z.lazy(() => DepartmentUpdateWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DepartmentUpdateManyWithWhereWithoutRoleInputSchema),z.lazy(() => DepartmentUpdateManyWithWhereWithoutRoleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DepartmentScalarWhereInputSchema),z.lazy(() => DepartmentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RolePermissionUncheckedUpdateManyWithoutRoleNestedInputSchema: z.ZodType<Prisma.RolePermissionUncheckedUpdateManyWithoutRoleNestedInput> = z.object({
  create: z.union([ z.lazy(() => RolePermissionCreateWithoutRoleInputSchema),z.lazy(() => RolePermissionCreateWithoutRoleInputSchema).array(),z.lazy(() => RolePermissionUncheckedCreateWithoutRoleInputSchema),z.lazy(() => RolePermissionUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RolePermissionCreateOrConnectWithoutRoleInputSchema),z.lazy(() => RolePermissionCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RolePermissionUpsertWithWhereUniqueWithoutRoleInputSchema),z.lazy(() => RolePermissionUpsertWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RolePermissionCreateManyRoleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RolePermissionWhereUniqueInputSchema),z.lazy(() => RolePermissionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RolePermissionWhereUniqueInputSchema),z.lazy(() => RolePermissionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RolePermissionWhereUniqueInputSchema),z.lazy(() => RolePermissionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RolePermissionWhereUniqueInputSchema),z.lazy(() => RolePermissionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RolePermissionUpdateWithWhereUniqueWithoutRoleInputSchema),z.lazy(() => RolePermissionUpdateWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RolePermissionUpdateManyWithWhereWithoutRoleInputSchema),z.lazy(() => RolePermissionUpdateManyWithWhereWithoutRoleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RolePermissionScalarWhereInputSchema),z.lazy(() => RolePermissionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserRoleUncheckedUpdateManyWithoutRoleNestedInputSchema: z.ZodType<Prisma.UserRoleUncheckedUpdateManyWithoutRoleNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserRoleCreateWithoutRoleInputSchema),z.lazy(() => UserRoleCreateWithoutRoleInputSchema).array(),z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputSchema),z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRoleCreateOrConnectWithoutRoleInputSchema),z.lazy(() => UserRoleCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserRoleUpsertWithWhereUniqueWithoutRoleInputSchema),z.lazy(() => UserRoleUpsertWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRoleCreateManyRoleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema),z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema),z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema),z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema),z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserRoleUpdateWithWhereUniqueWithoutRoleInputSchema),z.lazy(() => UserRoleUpdateWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserRoleUpdateManyWithWhereWithoutRoleInputSchema),z.lazy(() => UserRoleUpdateManyWithWhereWithoutRoleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserRoleScalarWhereInputSchema),z.lazy(() => UserRoleScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RoleCreateNestedOneWithoutRoleUsersInputSchema: z.ZodType<Prisma.RoleCreateNestedOneWithoutRoleUsersInput> = z.object({
  create: z.union([ z.lazy(() => RoleCreateWithoutRoleUsersInputSchema),z.lazy(() => RoleUncheckedCreateWithoutRoleUsersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoleCreateOrConnectWithoutRoleUsersInputSchema).optional(),
  connect: z.lazy(() => RoleWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutUserRoleInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutUserRoleInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutUserRoleInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserRoleInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutUserRoleInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const RoleUpdateOneRequiredWithoutRoleUsersNestedInputSchema: z.ZodType<Prisma.RoleUpdateOneRequiredWithoutRoleUsersNestedInput> = z.object({
  create: z.union([ z.lazy(() => RoleCreateWithoutRoleUsersInputSchema),z.lazy(() => RoleUncheckedCreateWithoutRoleUsersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoleCreateOrConnectWithoutRoleUsersInputSchema).optional(),
  upsert: z.lazy(() => RoleUpsertWithoutRoleUsersInputSchema).optional(),
  connect: z.lazy(() => RoleWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RoleUpdateToOneWithWhereWithoutRoleUsersInputSchema),z.lazy(() => RoleUpdateWithoutRoleUsersInputSchema),z.lazy(() => RoleUncheckedUpdateWithoutRoleUsersInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutUserRoleNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutUserRoleNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutUserRoleInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserRoleInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutUserRoleInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutUserRoleInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutUserRoleInputSchema),z.lazy(() => UserUpdateWithoutUserRoleInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUserRoleInputSchema) ]).optional(),
}).strict();

export const HospitalCreateNestedOneWithoutPermissionInputSchema: z.ZodType<Prisma.HospitalCreateNestedOneWithoutPermissionInput> = z.object({
  create: z.union([ z.lazy(() => HospitalCreateWithoutPermissionInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutPermissionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HospitalCreateOrConnectWithoutPermissionInputSchema).optional(),
  connect: z.lazy(() => HospitalWhereUniqueInputSchema).optional()
}).strict();

export const RolePermissionCreateNestedManyWithoutPermissionInputSchema: z.ZodType<Prisma.RolePermissionCreateNestedManyWithoutPermissionInput> = z.object({
  create: z.union([ z.lazy(() => RolePermissionCreateWithoutPermissionInputSchema),z.lazy(() => RolePermissionCreateWithoutPermissionInputSchema).array(),z.lazy(() => RolePermissionUncheckedCreateWithoutPermissionInputSchema),z.lazy(() => RolePermissionUncheckedCreateWithoutPermissionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RolePermissionCreateOrConnectWithoutPermissionInputSchema),z.lazy(() => RolePermissionCreateOrConnectWithoutPermissionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RolePermissionCreateManyPermissionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RolePermissionWhereUniqueInputSchema),z.lazy(() => RolePermissionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RolePermissionUncheckedCreateNestedManyWithoutPermissionInputSchema: z.ZodType<Prisma.RolePermissionUncheckedCreateNestedManyWithoutPermissionInput> = z.object({
  create: z.union([ z.lazy(() => RolePermissionCreateWithoutPermissionInputSchema),z.lazy(() => RolePermissionCreateWithoutPermissionInputSchema).array(),z.lazy(() => RolePermissionUncheckedCreateWithoutPermissionInputSchema),z.lazy(() => RolePermissionUncheckedCreateWithoutPermissionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RolePermissionCreateOrConnectWithoutPermissionInputSchema),z.lazy(() => RolePermissionCreateOrConnectWithoutPermissionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RolePermissionCreateManyPermissionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RolePermissionWhereUniqueInputSchema),z.lazy(() => RolePermissionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const HospitalUpdateOneRequiredWithoutPermissionNestedInputSchema: z.ZodType<Prisma.HospitalUpdateOneRequiredWithoutPermissionNestedInput> = z.object({
  create: z.union([ z.lazy(() => HospitalCreateWithoutPermissionInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutPermissionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HospitalCreateOrConnectWithoutPermissionInputSchema).optional(),
  upsert: z.lazy(() => HospitalUpsertWithoutPermissionInputSchema).optional(),
  connect: z.lazy(() => HospitalWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => HospitalUpdateToOneWithWhereWithoutPermissionInputSchema),z.lazy(() => HospitalUpdateWithoutPermissionInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutPermissionInputSchema) ]).optional(),
}).strict();

export const RolePermissionUpdateManyWithoutPermissionNestedInputSchema: z.ZodType<Prisma.RolePermissionUpdateManyWithoutPermissionNestedInput> = z.object({
  create: z.union([ z.lazy(() => RolePermissionCreateWithoutPermissionInputSchema),z.lazy(() => RolePermissionCreateWithoutPermissionInputSchema).array(),z.lazy(() => RolePermissionUncheckedCreateWithoutPermissionInputSchema),z.lazy(() => RolePermissionUncheckedCreateWithoutPermissionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RolePermissionCreateOrConnectWithoutPermissionInputSchema),z.lazy(() => RolePermissionCreateOrConnectWithoutPermissionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RolePermissionUpsertWithWhereUniqueWithoutPermissionInputSchema),z.lazy(() => RolePermissionUpsertWithWhereUniqueWithoutPermissionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RolePermissionCreateManyPermissionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RolePermissionWhereUniqueInputSchema),z.lazy(() => RolePermissionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RolePermissionWhereUniqueInputSchema),z.lazy(() => RolePermissionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RolePermissionWhereUniqueInputSchema),z.lazy(() => RolePermissionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RolePermissionWhereUniqueInputSchema),z.lazy(() => RolePermissionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RolePermissionUpdateWithWhereUniqueWithoutPermissionInputSchema),z.lazy(() => RolePermissionUpdateWithWhereUniqueWithoutPermissionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RolePermissionUpdateManyWithWhereWithoutPermissionInputSchema),z.lazy(() => RolePermissionUpdateManyWithWhereWithoutPermissionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RolePermissionScalarWhereInputSchema),z.lazy(() => RolePermissionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RolePermissionUncheckedUpdateManyWithoutPermissionNestedInputSchema: z.ZodType<Prisma.RolePermissionUncheckedUpdateManyWithoutPermissionNestedInput> = z.object({
  create: z.union([ z.lazy(() => RolePermissionCreateWithoutPermissionInputSchema),z.lazy(() => RolePermissionCreateWithoutPermissionInputSchema).array(),z.lazy(() => RolePermissionUncheckedCreateWithoutPermissionInputSchema),z.lazy(() => RolePermissionUncheckedCreateWithoutPermissionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RolePermissionCreateOrConnectWithoutPermissionInputSchema),z.lazy(() => RolePermissionCreateOrConnectWithoutPermissionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RolePermissionUpsertWithWhereUniqueWithoutPermissionInputSchema),z.lazy(() => RolePermissionUpsertWithWhereUniqueWithoutPermissionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RolePermissionCreateManyPermissionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RolePermissionWhereUniqueInputSchema),z.lazy(() => RolePermissionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RolePermissionWhereUniqueInputSchema),z.lazy(() => RolePermissionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RolePermissionWhereUniqueInputSchema),z.lazy(() => RolePermissionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RolePermissionWhereUniqueInputSchema),z.lazy(() => RolePermissionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RolePermissionUpdateWithWhereUniqueWithoutPermissionInputSchema),z.lazy(() => RolePermissionUpdateWithWhereUniqueWithoutPermissionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RolePermissionUpdateManyWithWhereWithoutPermissionInputSchema),z.lazy(() => RolePermissionUpdateManyWithWhereWithoutPermissionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RolePermissionScalarWhereInputSchema),z.lazy(() => RolePermissionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PermissionCreateNestedOneWithoutRolePermissionsInputSchema: z.ZodType<Prisma.PermissionCreateNestedOneWithoutRolePermissionsInput> = z.object({
  create: z.union([ z.lazy(() => PermissionCreateWithoutRolePermissionsInputSchema),z.lazy(() => PermissionUncheckedCreateWithoutRolePermissionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PermissionCreateOrConnectWithoutRolePermissionsInputSchema).optional(),
  connect: z.lazy(() => PermissionWhereUniqueInputSchema).optional()
}).strict();

export const RoleCreateNestedOneWithoutPermissionsInputSchema: z.ZodType<Prisma.RoleCreateNestedOneWithoutPermissionsInput> = z.object({
  create: z.union([ z.lazy(() => RoleCreateWithoutPermissionsInputSchema),z.lazy(() => RoleUncheckedCreateWithoutPermissionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoleCreateOrConnectWithoutPermissionsInputSchema).optional(),
  connect: z.lazy(() => RoleWhereUniqueInputSchema).optional()
}).strict();

export const PermissionUpdateOneRequiredWithoutRolePermissionsNestedInputSchema: z.ZodType<Prisma.PermissionUpdateOneRequiredWithoutRolePermissionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => PermissionCreateWithoutRolePermissionsInputSchema),z.lazy(() => PermissionUncheckedCreateWithoutRolePermissionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PermissionCreateOrConnectWithoutRolePermissionsInputSchema).optional(),
  upsert: z.lazy(() => PermissionUpsertWithoutRolePermissionsInputSchema).optional(),
  connect: z.lazy(() => PermissionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PermissionUpdateToOneWithWhereWithoutRolePermissionsInputSchema),z.lazy(() => PermissionUpdateWithoutRolePermissionsInputSchema),z.lazy(() => PermissionUncheckedUpdateWithoutRolePermissionsInputSchema) ]).optional(),
}).strict();

export const RoleUpdateOneRequiredWithoutPermissionsNestedInputSchema: z.ZodType<Prisma.RoleUpdateOneRequiredWithoutPermissionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => RoleCreateWithoutPermissionsInputSchema),z.lazy(() => RoleUncheckedCreateWithoutPermissionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoleCreateOrConnectWithoutPermissionsInputSchema).optional(),
  upsert: z.lazy(() => RoleUpsertWithoutPermissionsInputSchema).optional(),
  connect: z.lazy(() => RoleWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RoleUpdateToOneWithWhereWithoutPermissionsInputSchema),z.lazy(() => RoleUpdateWithoutPermissionsInputSchema),z.lazy(() => RoleUncheckedUpdateWithoutPermissionsInputSchema) ]).optional(),
}).strict();

export const HospitalCreateNestedOneWithoutVendorInputSchema: z.ZodType<Prisma.HospitalCreateNestedOneWithoutVendorInput> = z.object({
  create: z.union([ z.lazy(() => HospitalCreateWithoutVendorInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutVendorInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HospitalCreateOrConnectWithoutVendorInputSchema).optional(),
  connect: z.lazy(() => HospitalWhereUniqueInputSchema).optional()
}).strict();

export const HospitalUpdateOneRequiredWithoutVendorNestedInputSchema: z.ZodType<Prisma.HospitalUpdateOneRequiredWithoutVendorNestedInput> = z.object({
  create: z.union([ z.lazy(() => HospitalCreateWithoutVendorInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutVendorInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HospitalCreateOrConnectWithoutVendorInputSchema).optional(),
  upsert: z.lazy(() => HospitalUpsertWithoutVendorInputSchema).optional(),
  connect: z.lazy(() => HospitalWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => HospitalUpdateToOneWithWhereWithoutVendorInputSchema),z.lazy(() => HospitalUpdateWithoutVendorInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutVendorInputSchema) ]).optional(),
}).strict();

export const HospitalCreateNestedOneWithoutProductInputSchema: z.ZodType<Prisma.HospitalCreateNestedOneWithoutProductInput> = z.object({
  create: z.union([ z.lazy(() => HospitalCreateWithoutProductInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutProductInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HospitalCreateOrConnectWithoutProductInputSchema).optional(),
  connect: z.lazy(() => HospitalWhereUniqueInputSchema).optional()
}).strict();

export const ProductDepartmentCreateNestedManyWithoutProductInputSchema: z.ZodType<Prisma.ProductDepartmentCreateNestedManyWithoutProductInput> = z.object({
  create: z.union([ z.lazy(() => ProductDepartmentCreateWithoutProductInputSchema),z.lazy(() => ProductDepartmentCreateWithoutProductInputSchema).array(),z.lazy(() => ProductDepartmentUncheckedCreateWithoutProductInputSchema),z.lazy(() => ProductDepartmentUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductDepartmentCreateOrConnectWithoutProductInputSchema),z.lazy(() => ProductDepartmentCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductDepartmentCreateManyProductInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductDepartmentWhereUniqueInputSchema),z.lazy(() => ProductDepartmentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProductIntentCreateNestedManyWithoutProductInputSchema: z.ZodType<Prisma.ProductIntentCreateNestedManyWithoutProductInput> = z.object({
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutProductInputSchema),z.lazy(() => ProductIntentCreateWithoutProductInputSchema).array(),z.lazy(() => ProductIntentUncheckedCreateWithoutProductInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductIntentCreateOrConnectWithoutProductInputSchema),z.lazy(() => ProductIntentCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductIntentCreateManyProductInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProductDepartmentUncheckedCreateNestedManyWithoutProductInputSchema: z.ZodType<Prisma.ProductDepartmentUncheckedCreateNestedManyWithoutProductInput> = z.object({
  create: z.union([ z.lazy(() => ProductDepartmentCreateWithoutProductInputSchema),z.lazy(() => ProductDepartmentCreateWithoutProductInputSchema).array(),z.lazy(() => ProductDepartmentUncheckedCreateWithoutProductInputSchema),z.lazy(() => ProductDepartmentUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductDepartmentCreateOrConnectWithoutProductInputSchema),z.lazy(() => ProductDepartmentCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductDepartmentCreateManyProductInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductDepartmentWhereUniqueInputSchema),z.lazy(() => ProductDepartmentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProductIntentUncheckedCreateNestedManyWithoutProductInputSchema: z.ZodType<Prisma.ProductIntentUncheckedCreateNestedManyWithoutProductInput> = z.object({
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutProductInputSchema),z.lazy(() => ProductIntentCreateWithoutProductInputSchema).array(),z.lazy(() => ProductIntentUncheckedCreateWithoutProductInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductIntentCreateOrConnectWithoutProductInputSchema),z.lazy(() => ProductIntentCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductIntentCreateManyProductInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const HospitalUpdateOneRequiredWithoutProductNestedInputSchema: z.ZodType<Prisma.HospitalUpdateOneRequiredWithoutProductNestedInput> = z.object({
  create: z.union([ z.lazy(() => HospitalCreateWithoutProductInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutProductInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HospitalCreateOrConnectWithoutProductInputSchema).optional(),
  upsert: z.lazy(() => HospitalUpsertWithoutProductInputSchema).optional(),
  connect: z.lazy(() => HospitalWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => HospitalUpdateToOneWithWhereWithoutProductInputSchema),z.lazy(() => HospitalUpdateWithoutProductInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutProductInputSchema) ]).optional(),
}).strict();

export const ProductDepartmentUpdateManyWithoutProductNestedInputSchema: z.ZodType<Prisma.ProductDepartmentUpdateManyWithoutProductNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductDepartmentCreateWithoutProductInputSchema),z.lazy(() => ProductDepartmentCreateWithoutProductInputSchema).array(),z.lazy(() => ProductDepartmentUncheckedCreateWithoutProductInputSchema),z.lazy(() => ProductDepartmentUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductDepartmentCreateOrConnectWithoutProductInputSchema),z.lazy(() => ProductDepartmentCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductDepartmentUpsertWithWhereUniqueWithoutProductInputSchema),z.lazy(() => ProductDepartmentUpsertWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductDepartmentCreateManyProductInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductDepartmentWhereUniqueInputSchema),z.lazy(() => ProductDepartmentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductDepartmentWhereUniqueInputSchema),z.lazy(() => ProductDepartmentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductDepartmentWhereUniqueInputSchema),z.lazy(() => ProductDepartmentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductDepartmentWhereUniqueInputSchema),z.lazy(() => ProductDepartmentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductDepartmentUpdateWithWhereUniqueWithoutProductInputSchema),z.lazy(() => ProductDepartmentUpdateWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductDepartmentUpdateManyWithWhereWithoutProductInputSchema),z.lazy(() => ProductDepartmentUpdateManyWithWhereWithoutProductInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductDepartmentScalarWhereInputSchema),z.lazy(() => ProductDepartmentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProductIntentUpdateManyWithoutProductNestedInputSchema: z.ZodType<Prisma.ProductIntentUpdateManyWithoutProductNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutProductInputSchema),z.lazy(() => ProductIntentCreateWithoutProductInputSchema).array(),z.lazy(() => ProductIntentUncheckedCreateWithoutProductInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductIntentCreateOrConnectWithoutProductInputSchema),z.lazy(() => ProductIntentCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductIntentUpsertWithWhereUniqueWithoutProductInputSchema),z.lazy(() => ProductIntentUpsertWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductIntentCreateManyProductInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductIntentUpdateWithWhereUniqueWithoutProductInputSchema),z.lazy(() => ProductIntentUpdateWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductIntentUpdateManyWithWhereWithoutProductInputSchema),z.lazy(() => ProductIntentUpdateManyWithWhereWithoutProductInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductIntentScalarWhereInputSchema),z.lazy(() => ProductIntentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProductDepartmentUncheckedUpdateManyWithoutProductNestedInputSchema: z.ZodType<Prisma.ProductDepartmentUncheckedUpdateManyWithoutProductNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductDepartmentCreateWithoutProductInputSchema),z.lazy(() => ProductDepartmentCreateWithoutProductInputSchema).array(),z.lazy(() => ProductDepartmentUncheckedCreateWithoutProductInputSchema),z.lazy(() => ProductDepartmentUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductDepartmentCreateOrConnectWithoutProductInputSchema),z.lazy(() => ProductDepartmentCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductDepartmentUpsertWithWhereUniqueWithoutProductInputSchema),z.lazy(() => ProductDepartmentUpsertWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductDepartmentCreateManyProductInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductDepartmentWhereUniqueInputSchema),z.lazy(() => ProductDepartmentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductDepartmentWhereUniqueInputSchema),z.lazy(() => ProductDepartmentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductDepartmentWhereUniqueInputSchema),z.lazy(() => ProductDepartmentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductDepartmentWhereUniqueInputSchema),z.lazy(() => ProductDepartmentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductDepartmentUpdateWithWhereUniqueWithoutProductInputSchema),z.lazy(() => ProductDepartmentUpdateWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductDepartmentUpdateManyWithWhereWithoutProductInputSchema),z.lazy(() => ProductDepartmentUpdateManyWithWhereWithoutProductInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductDepartmentScalarWhereInputSchema),z.lazy(() => ProductDepartmentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProductIntentUncheckedUpdateManyWithoutProductNestedInputSchema: z.ZodType<Prisma.ProductIntentUncheckedUpdateManyWithoutProductNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutProductInputSchema),z.lazy(() => ProductIntentCreateWithoutProductInputSchema).array(),z.lazy(() => ProductIntentUncheckedCreateWithoutProductInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductIntentCreateOrConnectWithoutProductInputSchema),z.lazy(() => ProductIntentCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductIntentUpsertWithWhereUniqueWithoutProductInputSchema),z.lazy(() => ProductIntentUpsertWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductIntentCreateManyProductInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductIntentUpdateWithWhereUniqueWithoutProductInputSchema),z.lazy(() => ProductIntentUpdateWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductIntentUpdateManyWithWhereWithoutProductInputSchema),z.lazy(() => ProductIntentUpdateManyWithWhereWithoutProductInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductIntentScalarWhereInputSchema),z.lazy(() => ProductIntentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DepartmentCreateNestedOneWithoutProductDepartmentInputSchema: z.ZodType<Prisma.DepartmentCreateNestedOneWithoutProductDepartmentInput> = z.object({
  create: z.union([ z.lazy(() => DepartmentCreateWithoutProductDepartmentInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutProductDepartmentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DepartmentCreateOrConnectWithoutProductDepartmentInputSchema).optional(),
  connect: z.lazy(() => DepartmentWhereUniqueInputSchema).optional()
}).strict();

export const ProductCreateNestedOneWithoutProductDepartmentInputSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutProductDepartmentInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutProductDepartmentInputSchema),z.lazy(() => ProductUncheckedCreateWithoutProductDepartmentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutProductDepartmentInputSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputSchema).optional()
}).strict();

export const DepartmentUpdateOneRequiredWithoutProductDepartmentNestedInputSchema: z.ZodType<Prisma.DepartmentUpdateOneRequiredWithoutProductDepartmentNestedInput> = z.object({
  create: z.union([ z.lazy(() => DepartmentCreateWithoutProductDepartmentInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutProductDepartmentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DepartmentCreateOrConnectWithoutProductDepartmentInputSchema).optional(),
  upsert: z.lazy(() => DepartmentUpsertWithoutProductDepartmentInputSchema).optional(),
  connect: z.lazy(() => DepartmentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DepartmentUpdateToOneWithWhereWithoutProductDepartmentInputSchema),z.lazy(() => DepartmentUpdateWithoutProductDepartmentInputSchema),z.lazy(() => DepartmentUncheckedUpdateWithoutProductDepartmentInputSchema) ]).optional(),
}).strict();

export const ProductUpdateOneRequiredWithoutProductDepartmentNestedInputSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutProductDepartmentNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutProductDepartmentInputSchema),z.lazy(() => ProductUncheckedCreateWithoutProductDepartmentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutProductDepartmentInputSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutProductDepartmentInputSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProductUpdateToOneWithWhereWithoutProductDepartmentInputSchema),z.lazy(() => ProductUpdateWithoutProductDepartmentInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutProductDepartmentInputSchema) ]).optional(),
}).strict();

export const HospitalCreateNestedOneWithoutIntentTrackInputSchema: z.ZodType<Prisma.HospitalCreateNestedOneWithoutIntentTrackInput> = z.object({
  create: z.union([ z.lazy(() => HospitalCreateWithoutIntentTrackInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutIntentTrackInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HospitalCreateOrConnectWithoutIntentTrackInputSchema).optional(),
  connect: z.lazy(() => HospitalWhereUniqueInputSchema).optional()
}).strict();

export const IntentStatusCreateNestedOneWithoutTracksInputSchema: z.ZodType<Prisma.IntentStatusCreateNestedOneWithoutTracksInput> = z.object({
  create: z.union([ z.lazy(() => IntentStatusCreateWithoutTracksInputSchema),z.lazy(() => IntentStatusUncheckedCreateWithoutTracksInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => IntentStatusCreateOrConnectWithoutTracksInputSchema).optional(),
  connect: z.lazy(() => IntentStatusWhereUniqueInputSchema).optional()
}).strict();

export const ProductIntentCreateNestedManyWithoutTrackInputSchema: z.ZodType<Prisma.ProductIntentCreateNestedManyWithoutTrackInput> = z.object({
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutTrackInputSchema),z.lazy(() => ProductIntentCreateWithoutTrackInputSchema).array(),z.lazy(() => ProductIntentUncheckedCreateWithoutTrackInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutTrackInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductIntentCreateOrConnectWithoutTrackInputSchema),z.lazy(() => ProductIntentCreateOrConnectWithoutTrackInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductIntentCreateManyTrackInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProductIntentUncheckedCreateNestedManyWithoutTrackInputSchema: z.ZodType<Prisma.ProductIntentUncheckedCreateNestedManyWithoutTrackInput> = z.object({
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutTrackInputSchema),z.lazy(() => ProductIntentCreateWithoutTrackInputSchema).array(),z.lazy(() => ProductIntentUncheckedCreateWithoutTrackInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutTrackInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductIntentCreateOrConnectWithoutTrackInputSchema),z.lazy(() => ProductIntentCreateOrConnectWithoutTrackInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductIntentCreateManyTrackInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const HospitalUpdateOneRequiredWithoutIntentTrackNestedInputSchema: z.ZodType<Prisma.HospitalUpdateOneRequiredWithoutIntentTrackNestedInput> = z.object({
  create: z.union([ z.lazy(() => HospitalCreateWithoutIntentTrackInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutIntentTrackInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HospitalCreateOrConnectWithoutIntentTrackInputSchema).optional(),
  upsert: z.lazy(() => HospitalUpsertWithoutIntentTrackInputSchema).optional(),
  connect: z.lazy(() => HospitalWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => HospitalUpdateToOneWithWhereWithoutIntentTrackInputSchema),z.lazy(() => HospitalUpdateWithoutIntentTrackInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutIntentTrackInputSchema) ]).optional(),
}).strict();

export const IntentStatusUpdateOneRequiredWithoutTracksNestedInputSchema: z.ZodType<Prisma.IntentStatusUpdateOneRequiredWithoutTracksNestedInput> = z.object({
  create: z.union([ z.lazy(() => IntentStatusCreateWithoutTracksInputSchema),z.lazy(() => IntentStatusUncheckedCreateWithoutTracksInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => IntentStatusCreateOrConnectWithoutTracksInputSchema).optional(),
  upsert: z.lazy(() => IntentStatusUpsertWithoutTracksInputSchema).optional(),
  connect: z.lazy(() => IntentStatusWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => IntentStatusUpdateToOneWithWhereWithoutTracksInputSchema),z.lazy(() => IntentStatusUpdateWithoutTracksInputSchema),z.lazy(() => IntentStatusUncheckedUpdateWithoutTracksInputSchema) ]).optional(),
}).strict();

export const ProductIntentUpdateManyWithoutTrackNestedInputSchema: z.ZodType<Prisma.ProductIntentUpdateManyWithoutTrackNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutTrackInputSchema),z.lazy(() => ProductIntentCreateWithoutTrackInputSchema).array(),z.lazy(() => ProductIntentUncheckedCreateWithoutTrackInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutTrackInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductIntentCreateOrConnectWithoutTrackInputSchema),z.lazy(() => ProductIntentCreateOrConnectWithoutTrackInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductIntentUpsertWithWhereUniqueWithoutTrackInputSchema),z.lazy(() => ProductIntentUpsertWithWhereUniqueWithoutTrackInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductIntentCreateManyTrackInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductIntentUpdateWithWhereUniqueWithoutTrackInputSchema),z.lazy(() => ProductIntentUpdateWithWhereUniqueWithoutTrackInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductIntentUpdateManyWithWhereWithoutTrackInputSchema),z.lazy(() => ProductIntentUpdateManyWithWhereWithoutTrackInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductIntentScalarWhereInputSchema),z.lazy(() => ProductIntentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProductIntentUncheckedUpdateManyWithoutTrackNestedInputSchema: z.ZodType<Prisma.ProductIntentUncheckedUpdateManyWithoutTrackNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutTrackInputSchema),z.lazy(() => ProductIntentCreateWithoutTrackInputSchema).array(),z.lazy(() => ProductIntentUncheckedCreateWithoutTrackInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutTrackInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductIntentCreateOrConnectWithoutTrackInputSchema),z.lazy(() => ProductIntentCreateOrConnectWithoutTrackInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductIntentUpsertWithWhereUniqueWithoutTrackInputSchema),z.lazy(() => ProductIntentUpsertWithWhereUniqueWithoutTrackInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductIntentCreateManyTrackInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductIntentUpdateWithWhereUniqueWithoutTrackInputSchema),z.lazy(() => ProductIntentUpdateWithWhereUniqueWithoutTrackInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductIntentUpdateManyWithWhereWithoutTrackInputSchema),z.lazy(() => ProductIntentUpdateManyWithWhereWithoutTrackInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductIntentScalarWhereInputSchema),z.lazy(() => ProductIntentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const IntentTrackCreateNestedManyWithoutIntentStatusInputSchema: z.ZodType<Prisma.IntentTrackCreateNestedManyWithoutIntentStatusInput> = z.object({
  create: z.union([ z.lazy(() => IntentTrackCreateWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackCreateWithoutIntentStatusInputSchema).array(),z.lazy(() => IntentTrackUncheckedCreateWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackUncheckedCreateWithoutIntentStatusInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => IntentTrackCreateOrConnectWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackCreateOrConnectWithoutIntentStatusInputSchema).array() ]).optional(),
  createMany: z.lazy(() => IntentTrackCreateManyIntentStatusInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => IntentTrackWhereUniqueInputSchema),z.lazy(() => IntentTrackWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProductIntentCreateNestedManyWithoutIntentInputSchema: z.ZodType<Prisma.ProductIntentCreateNestedManyWithoutIntentInput> = z.object({
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutIntentInputSchema),z.lazy(() => ProductIntentCreateWithoutIntentInputSchema).array(),z.lazy(() => ProductIntentUncheckedCreateWithoutIntentInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutIntentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductIntentCreateOrConnectWithoutIntentInputSchema),z.lazy(() => ProductIntentCreateOrConnectWithoutIntentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductIntentCreateManyIntentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const IntentTrackUncheckedCreateNestedManyWithoutIntentStatusInputSchema: z.ZodType<Prisma.IntentTrackUncheckedCreateNestedManyWithoutIntentStatusInput> = z.object({
  create: z.union([ z.lazy(() => IntentTrackCreateWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackCreateWithoutIntentStatusInputSchema).array(),z.lazy(() => IntentTrackUncheckedCreateWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackUncheckedCreateWithoutIntentStatusInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => IntentTrackCreateOrConnectWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackCreateOrConnectWithoutIntentStatusInputSchema).array() ]).optional(),
  createMany: z.lazy(() => IntentTrackCreateManyIntentStatusInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => IntentTrackWhereUniqueInputSchema),z.lazy(() => IntentTrackWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProductIntentUncheckedCreateNestedManyWithoutIntentInputSchema: z.ZodType<Prisma.ProductIntentUncheckedCreateNestedManyWithoutIntentInput> = z.object({
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutIntentInputSchema),z.lazy(() => ProductIntentCreateWithoutIntentInputSchema).array(),z.lazy(() => ProductIntentUncheckedCreateWithoutIntentInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutIntentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductIntentCreateOrConnectWithoutIntentInputSchema),z.lazy(() => ProductIntentCreateOrConnectWithoutIntentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductIntentCreateManyIntentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const IntentTrackUpdateManyWithoutIntentStatusNestedInputSchema: z.ZodType<Prisma.IntentTrackUpdateManyWithoutIntentStatusNestedInput> = z.object({
  create: z.union([ z.lazy(() => IntentTrackCreateWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackCreateWithoutIntentStatusInputSchema).array(),z.lazy(() => IntentTrackUncheckedCreateWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackUncheckedCreateWithoutIntentStatusInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => IntentTrackCreateOrConnectWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackCreateOrConnectWithoutIntentStatusInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => IntentTrackUpsertWithWhereUniqueWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackUpsertWithWhereUniqueWithoutIntentStatusInputSchema).array() ]).optional(),
  createMany: z.lazy(() => IntentTrackCreateManyIntentStatusInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => IntentTrackWhereUniqueInputSchema),z.lazy(() => IntentTrackWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => IntentTrackWhereUniqueInputSchema),z.lazy(() => IntentTrackWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => IntentTrackWhereUniqueInputSchema),z.lazy(() => IntentTrackWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => IntentTrackWhereUniqueInputSchema),z.lazy(() => IntentTrackWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => IntentTrackUpdateWithWhereUniqueWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackUpdateWithWhereUniqueWithoutIntentStatusInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => IntentTrackUpdateManyWithWhereWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackUpdateManyWithWhereWithoutIntentStatusInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => IntentTrackScalarWhereInputSchema),z.lazy(() => IntentTrackScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProductIntentUpdateManyWithoutIntentNestedInputSchema: z.ZodType<Prisma.ProductIntentUpdateManyWithoutIntentNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutIntentInputSchema),z.lazy(() => ProductIntentCreateWithoutIntentInputSchema).array(),z.lazy(() => ProductIntentUncheckedCreateWithoutIntentInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutIntentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductIntentCreateOrConnectWithoutIntentInputSchema),z.lazy(() => ProductIntentCreateOrConnectWithoutIntentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductIntentUpsertWithWhereUniqueWithoutIntentInputSchema),z.lazy(() => ProductIntentUpsertWithWhereUniqueWithoutIntentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductIntentCreateManyIntentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductIntentUpdateWithWhereUniqueWithoutIntentInputSchema),z.lazy(() => ProductIntentUpdateWithWhereUniqueWithoutIntentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductIntentUpdateManyWithWhereWithoutIntentInputSchema),z.lazy(() => ProductIntentUpdateManyWithWhereWithoutIntentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductIntentScalarWhereInputSchema),z.lazy(() => ProductIntentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const IntentTrackUncheckedUpdateManyWithoutIntentStatusNestedInputSchema: z.ZodType<Prisma.IntentTrackUncheckedUpdateManyWithoutIntentStatusNestedInput> = z.object({
  create: z.union([ z.lazy(() => IntentTrackCreateWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackCreateWithoutIntentStatusInputSchema).array(),z.lazy(() => IntentTrackUncheckedCreateWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackUncheckedCreateWithoutIntentStatusInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => IntentTrackCreateOrConnectWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackCreateOrConnectWithoutIntentStatusInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => IntentTrackUpsertWithWhereUniqueWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackUpsertWithWhereUniqueWithoutIntentStatusInputSchema).array() ]).optional(),
  createMany: z.lazy(() => IntentTrackCreateManyIntentStatusInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => IntentTrackWhereUniqueInputSchema),z.lazy(() => IntentTrackWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => IntentTrackWhereUniqueInputSchema),z.lazy(() => IntentTrackWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => IntentTrackWhereUniqueInputSchema),z.lazy(() => IntentTrackWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => IntentTrackWhereUniqueInputSchema),z.lazy(() => IntentTrackWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => IntentTrackUpdateWithWhereUniqueWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackUpdateWithWhereUniqueWithoutIntentStatusInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => IntentTrackUpdateManyWithWhereWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackUpdateManyWithWhereWithoutIntentStatusInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => IntentTrackScalarWhereInputSchema),z.lazy(() => IntentTrackScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProductIntentUncheckedUpdateManyWithoutIntentNestedInputSchema: z.ZodType<Prisma.ProductIntentUncheckedUpdateManyWithoutIntentNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutIntentInputSchema),z.lazy(() => ProductIntentCreateWithoutIntentInputSchema).array(),z.lazy(() => ProductIntentUncheckedCreateWithoutIntentInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutIntentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductIntentCreateOrConnectWithoutIntentInputSchema),z.lazy(() => ProductIntentCreateOrConnectWithoutIntentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductIntentUpsertWithWhereUniqueWithoutIntentInputSchema),z.lazy(() => ProductIntentUpsertWithWhereUniqueWithoutIntentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductIntentCreateManyIntentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductIntentWhereUniqueInputSchema),z.lazy(() => ProductIntentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductIntentUpdateWithWhereUniqueWithoutIntentInputSchema),z.lazy(() => ProductIntentUpdateWithWhereUniqueWithoutIntentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductIntentUpdateManyWithWhereWithoutIntentInputSchema),z.lazy(() => ProductIntentUpdateManyWithWhereWithoutIntentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductIntentScalarWhereInputSchema),z.lazy(() => ProductIntentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const HospitalCreateNestedOneWithoutProductIntentInputSchema: z.ZodType<Prisma.HospitalCreateNestedOneWithoutProductIntentInput> = z.object({
  create: z.union([ z.lazy(() => HospitalCreateWithoutProductIntentInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutProductIntentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HospitalCreateOrConnectWithoutProductIntentInputSchema).optional(),
  connect: z.lazy(() => HospitalWhereUniqueInputSchema).optional()
}).strict();

export const IntentStatusCreateNestedOneWithoutProductIntentInputSchema: z.ZodType<Prisma.IntentStatusCreateNestedOneWithoutProductIntentInput> = z.object({
  create: z.union([ z.lazy(() => IntentStatusCreateWithoutProductIntentInputSchema),z.lazy(() => IntentStatusUncheckedCreateWithoutProductIntentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => IntentStatusCreateOrConnectWithoutProductIntentInputSchema).optional(),
  connect: z.lazy(() => IntentStatusWhereUniqueInputSchema).optional()
}).strict();

export const ProductCreateNestedOneWithoutProductIntentInputSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutProductIntentInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutProductIntentInputSchema),z.lazy(() => ProductUncheckedCreateWithoutProductIntentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutProductIntentInputSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputSchema).optional()
}).strict();

export const IntentTrackCreateNestedOneWithoutProductIntentInputSchema: z.ZodType<Prisma.IntentTrackCreateNestedOneWithoutProductIntentInput> = z.object({
  create: z.union([ z.lazy(() => IntentTrackCreateWithoutProductIntentInputSchema),z.lazy(() => IntentTrackUncheckedCreateWithoutProductIntentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => IntentTrackCreateOrConnectWithoutProductIntentInputSchema).optional(),
  connect: z.lazy(() => IntentTrackWhereUniqueInputSchema).optional()
}).strict();

export const HospitalUpdateOneRequiredWithoutProductIntentNestedInputSchema: z.ZodType<Prisma.HospitalUpdateOneRequiredWithoutProductIntentNestedInput> = z.object({
  create: z.union([ z.lazy(() => HospitalCreateWithoutProductIntentInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutProductIntentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HospitalCreateOrConnectWithoutProductIntentInputSchema).optional(),
  upsert: z.lazy(() => HospitalUpsertWithoutProductIntentInputSchema).optional(),
  connect: z.lazy(() => HospitalWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => HospitalUpdateToOneWithWhereWithoutProductIntentInputSchema),z.lazy(() => HospitalUpdateWithoutProductIntentInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutProductIntentInputSchema) ]).optional(),
}).strict();

export const IntentStatusUpdateOneRequiredWithoutProductIntentNestedInputSchema: z.ZodType<Prisma.IntentStatusUpdateOneRequiredWithoutProductIntentNestedInput> = z.object({
  create: z.union([ z.lazy(() => IntentStatusCreateWithoutProductIntentInputSchema),z.lazy(() => IntentStatusUncheckedCreateWithoutProductIntentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => IntentStatusCreateOrConnectWithoutProductIntentInputSchema).optional(),
  upsert: z.lazy(() => IntentStatusUpsertWithoutProductIntentInputSchema).optional(),
  connect: z.lazy(() => IntentStatusWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => IntentStatusUpdateToOneWithWhereWithoutProductIntentInputSchema),z.lazy(() => IntentStatusUpdateWithoutProductIntentInputSchema),z.lazy(() => IntentStatusUncheckedUpdateWithoutProductIntentInputSchema) ]).optional(),
}).strict();

export const ProductUpdateOneRequiredWithoutProductIntentNestedInputSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutProductIntentNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutProductIntentInputSchema),z.lazy(() => ProductUncheckedCreateWithoutProductIntentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutProductIntentInputSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutProductIntentInputSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProductUpdateToOneWithWhereWithoutProductIntentInputSchema),z.lazy(() => ProductUpdateWithoutProductIntentInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutProductIntentInputSchema) ]).optional(),
}).strict();

export const IntentTrackUpdateOneRequiredWithoutProductIntentNestedInputSchema: z.ZodType<Prisma.IntentTrackUpdateOneRequiredWithoutProductIntentNestedInput> = z.object({
  create: z.union([ z.lazy(() => IntentTrackCreateWithoutProductIntentInputSchema),z.lazy(() => IntentTrackUncheckedCreateWithoutProductIntentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => IntentTrackCreateOrConnectWithoutProductIntentInputSchema).optional(),
  upsert: z.lazy(() => IntentTrackUpsertWithoutProductIntentInputSchema).optional(),
  connect: z.lazy(() => IntentTrackWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => IntentTrackUpdateToOneWithWhereWithoutProductIntentInputSchema),z.lazy(() => IntentTrackUpdateWithoutProductIntentInputSchema),z.lazy(() => IntentTrackUncheckedUpdateWithoutProductIntentInputSchema) ]).optional(),
}).strict();

export const AssessmentCreateNestedManyWithoutPatientInputSchema: z.ZodType<Prisma.AssessmentCreateNestedManyWithoutPatientInput> = z.object({
  create: z.union([ z.lazy(() => AssessmentCreateWithoutPatientInputSchema),z.lazy(() => AssessmentCreateWithoutPatientInputSchema).array(),z.lazy(() => AssessmentUncheckedCreateWithoutPatientInputSchema),z.lazy(() => AssessmentUncheckedCreateWithoutPatientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AssessmentCreateOrConnectWithoutPatientInputSchema),z.lazy(() => AssessmentCreateOrConnectWithoutPatientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AssessmentCreateManyPatientInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AssessmentWhereUniqueInputSchema),z.lazy(() => AssessmentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PatientVisitCreateNestedManyWithoutPatientInputSchema: z.ZodType<Prisma.PatientVisitCreateNestedManyWithoutPatientInput> = z.object({
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutPatientInputSchema),z.lazy(() => PatientVisitCreateWithoutPatientInputSchema).array(),z.lazy(() => PatientVisitUncheckedCreateWithoutPatientInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutPatientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PatientVisitCreateOrConnectWithoutPatientInputSchema),z.lazy(() => PatientVisitCreateOrConnectWithoutPatientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PatientVisitCreateManyPatientInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AssessmentUncheckedCreateNestedManyWithoutPatientInputSchema: z.ZodType<Prisma.AssessmentUncheckedCreateNestedManyWithoutPatientInput> = z.object({
  create: z.union([ z.lazy(() => AssessmentCreateWithoutPatientInputSchema),z.lazy(() => AssessmentCreateWithoutPatientInputSchema).array(),z.lazy(() => AssessmentUncheckedCreateWithoutPatientInputSchema),z.lazy(() => AssessmentUncheckedCreateWithoutPatientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AssessmentCreateOrConnectWithoutPatientInputSchema),z.lazy(() => AssessmentCreateOrConnectWithoutPatientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AssessmentCreateManyPatientInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AssessmentWhereUniqueInputSchema),z.lazy(() => AssessmentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PatientVisitUncheckedCreateNestedManyWithoutPatientInputSchema: z.ZodType<Prisma.PatientVisitUncheckedCreateNestedManyWithoutPatientInput> = z.object({
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutPatientInputSchema),z.lazy(() => PatientVisitCreateWithoutPatientInputSchema).array(),z.lazy(() => PatientVisitUncheckedCreateWithoutPatientInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutPatientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PatientVisitCreateOrConnectWithoutPatientInputSchema),z.lazy(() => PatientVisitCreateOrConnectWithoutPatientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PatientVisitCreateManyPatientInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumGenderFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumGenderFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => GenderSchema).optional()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const AssessmentUpdateManyWithoutPatientNestedInputSchema: z.ZodType<Prisma.AssessmentUpdateManyWithoutPatientNestedInput> = z.object({
  create: z.union([ z.lazy(() => AssessmentCreateWithoutPatientInputSchema),z.lazy(() => AssessmentCreateWithoutPatientInputSchema).array(),z.lazy(() => AssessmentUncheckedCreateWithoutPatientInputSchema),z.lazy(() => AssessmentUncheckedCreateWithoutPatientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AssessmentCreateOrConnectWithoutPatientInputSchema),z.lazy(() => AssessmentCreateOrConnectWithoutPatientInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AssessmentUpsertWithWhereUniqueWithoutPatientInputSchema),z.lazy(() => AssessmentUpsertWithWhereUniqueWithoutPatientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AssessmentCreateManyPatientInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AssessmentWhereUniqueInputSchema),z.lazy(() => AssessmentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AssessmentWhereUniqueInputSchema),z.lazy(() => AssessmentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AssessmentWhereUniqueInputSchema),z.lazy(() => AssessmentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AssessmentWhereUniqueInputSchema),z.lazy(() => AssessmentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AssessmentUpdateWithWhereUniqueWithoutPatientInputSchema),z.lazy(() => AssessmentUpdateWithWhereUniqueWithoutPatientInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AssessmentUpdateManyWithWhereWithoutPatientInputSchema),z.lazy(() => AssessmentUpdateManyWithWhereWithoutPatientInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AssessmentScalarWhereInputSchema),z.lazy(() => AssessmentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PatientVisitUpdateManyWithoutPatientNestedInputSchema: z.ZodType<Prisma.PatientVisitUpdateManyWithoutPatientNestedInput> = z.object({
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutPatientInputSchema),z.lazy(() => PatientVisitCreateWithoutPatientInputSchema).array(),z.lazy(() => PatientVisitUncheckedCreateWithoutPatientInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutPatientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PatientVisitCreateOrConnectWithoutPatientInputSchema),z.lazy(() => PatientVisitCreateOrConnectWithoutPatientInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PatientVisitUpsertWithWhereUniqueWithoutPatientInputSchema),z.lazy(() => PatientVisitUpsertWithWhereUniqueWithoutPatientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PatientVisitCreateManyPatientInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PatientVisitUpdateWithWhereUniqueWithoutPatientInputSchema),z.lazy(() => PatientVisitUpdateWithWhereUniqueWithoutPatientInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PatientVisitUpdateManyWithWhereWithoutPatientInputSchema),z.lazy(() => PatientVisitUpdateManyWithWhereWithoutPatientInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PatientVisitScalarWhereInputSchema),z.lazy(() => PatientVisitScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AssessmentUncheckedUpdateManyWithoutPatientNestedInputSchema: z.ZodType<Prisma.AssessmentUncheckedUpdateManyWithoutPatientNestedInput> = z.object({
  create: z.union([ z.lazy(() => AssessmentCreateWithoutPatientInputSchema),z.lazy(() => AssessmentCreateWithoutPatientInputSchema).array(),z.lazy(() => AssessmentUncheckedCreateWithoutPatientInputSchema),z.lazy(() => AssessmentUncheckedCreateWithoutPatientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AssessmentCreateOrConnectWithoutPatientInputSchema),z.lazy(() => AssessmentCreateOrConnectWithoutPatientInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AssessmentUpsertWithWhereUniqueWithoutPatientInputSchema),z.lazy(() => AssessmentUpsertWithWhereUniqueWithoutPatientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AssessmentCreateManyPatientInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AssessmentWhereUniqueInputSchema),z.lazy(() => AssessmentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AssessmentWhereUniqueInputSchema),z.lazy(() => AssessmentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AssessmentWhereUniqueInputSchema),z.lazy(() => AssessmentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AssessmentWhereUniqueInputSchema),z.lazy(() => AssessmentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AssessmentUpdateWithWhereUniqueWithoutPatientInputSchema),z.lazy(() => AssessmentUpdateWithWhereUniqueWithoutPatientInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AssessmentUpdateManyWithWhereWithoutPatientInputSchema),z.lazy(() => AssessmentUpdateManyWithWhereWithoutPatientInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AssessmentScalarWhereInputSchema),z.lazy(() => AssessmentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PatientVisitUncheckedUpdateManyWithoutPatientNestedInputSchema: z.ZodType<Prisma.PatientVisitUncheckedUpdateManyWithoutPatientNestedInput> = z.object({
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutPatientInputSchema),z.lazy(() => PatientVisitCreateWithoutPatientInputSchema).array(),z.lazy(() => PatientVisitUncheckedCreateWithoutPatientInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutPatientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PatientVisitCreateOrConnectWithoutPatientInputSchema),z.lazy(() => PatientVisitCreateOrConnectWithoutPatientInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PatientVisitUpsertWithWhereUniqueWithoutPatientInputSchema),z.lazy(() => PatientVisitUpsertWithWhereUniqueWithoutPatientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PatientVisitCreateManyPatientInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PatientVisitWhereUniqueInputSchema),z.lazy(() => PatientVisitWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PatientVisitUpdateWithWhereUniqueWithoutPatientInputSchema),z.lazy(() => PatientVisitUpdateWithWhereUniqueWithoutPatientInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PatientVisitUpdateManyWithWhereWithoutPatientInputSchema),z.lazy(() => PatientVisitUpdateManyWithWhereWithoutPatientInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PatientVisitScalarWhereInputSchema),z.lazy(() => PatientVisitScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AssessmentCreateNestedOneWithoutPatientVisitInputSchema: z.ZodType<Prisma.AssessmentCreateNestedOneWithoutPatientVisitInput> = z.object({
  create: z.union([ z.lazy(() => AssessmentCreateWithoutPatientVisitInputSchema),z.lazy(() => AssessmentUncheckedCreateWithoutPatientVisitInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AssessmentCreateOrConnectWithoutPatientVisitInputSchema).optional(),
  connect: z.lazy(() => AssessmentWhereUniqueInputSchema).optional()
}).strict();

export const DepartmentCreateNestedOneWithoutPatientVisitInputSchema: z.ZodType<Prisma.DepartmentCreateNestedOneWithoutPatientVisitInput> = z.object({
  create: z.union([ z.lazy(() => DepartmentCreateWithoutPatientVisitInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutPatientVisitInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DepartmentCreateOrConnectWithoutPatientVisitInputSchema).optional(),
  connect: z.lazy(() => DepartmentWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutPatientVisitInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutPatientVisitInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPatientVisitInputSchema),z.lazy(() => UserUncheckedCreateWithoutPatientVisitInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPatientVisitInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const HospitalCreateNestedOneWithoutPatientVisitInputSchema: z.ZodType<Prisma.HospitalCreateNestedOneWithoutPatientVisitInput> = z.object({
  create: z.union([ z.lazy(() => HospitalCreateWithoutPatientVisitInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutPatientVisitInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HospitalCreateOrConnectWithoutPatientVisitInputSchema).optional(),
  connect: z.lazy(() => HospitalWhereUniqueInputSchema).optional()
}).strict();

export const PatientCreateNestedOneWithoutPatientVisitInputSchema: z.ZodType<Prisma.PatientCreateNestedOneWithoutPatientVisitInput> = z.object({
  create: z.union([ z.lazy(() => PatientCreateWithoutPatientVisitInputSchema),z.lazy(() => PatientUncheckedCreateWithoutPatientVisitInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PatientCreateOrConnectWithoutPatientVisitInputSchema).optional(),
  connect: z.lazy(() => PatientWhereUniqueInputSchema).optional()
}).strict();

export const AssessmentUncheckedCreateNestedOneWithoutPatientVisitInputSchema: z.ZodType<Prisma.AssessmentUncheckedCreateNestedOneWithoutPatientVisitInput> = z.object({
  create: z.union([ z.lazy(() => AssessmentCreateWithoutPatientVisitInputSchema),z.lazy(() => AssessmentUncheckedCreateWithoutPatientVisitInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AssessmentCreateOrConnectWithoutPatientVisitInputSchema).optional(),
  connect: z.lazy(() => AssessmentWhereUniqueInputSchema).optional()
}).strict();

export const AssessmentUpdateOneWithoutPatientVisitNestedInputSchema: z.ZodType<Prisma.AssessmentUpdateOneWithoutPatientVisitNestedInput> = z.object({
  create: z.union([ z.lazy(() => AssessmentCreateWithoutPatientVisitInputSchema),z.lazy(() => AssessmentUncheckedCreateWithoutPatientVisitInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AssessmentCreateOrConnectWithoutPatientVisitInputSchema).optional(),
  upsert: z.lazy(() => AssessmentUpsertWithoutPatientVisitInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AssessmentWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AssessmentWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AssessmentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AssessmentUpdateToOneWithWhereWithoutPatientVisitInputSchema),z.lazy(() => AssessmentUpdateWithoutPatientVisitInputSchema),z.lazy(() => AssessmentUncheckedUpdateWithoutPatientVisitInputSchema) ]).optional(),
}).strict();

export const DepartmentUpdateOneRequiredWithoutPatientVisitNestedInputSchema: z.ZodType<Prisma.DepartmentUpdateOneRequiredWithoutPatientVisitNestedInput> = z.object({
  create: z.union([ z.lazy(() => DepartmentCreateWithoutPatientVisitInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutPatientVisitInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DepartmentCreateOrConnectWithoutPatientVisitInputSchema).optional(),
  upsert: z.lazy(() => DepartmentUpsertWithoutPatientVisitInputSchema).optional(),
  connect: z.lazy(() => DepartmentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DepartmentUpdateToOneWithWhereWithoutPatientVisitInputSchema),z.lazy(() => DepartmentUpdateWithoutPatientVisitInputSchema),z.lazy(() => DepartmentUncheckedUpdateWithoutPatientVisitInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutPatientVisitNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutPatientVisitNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPatientVisitInputSchema),z.lazy(() => UserUncheckedCreateWithoutPatientVisitInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPatientVisitInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutPatientVisitInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutPatientVisitInputSchema),z.lazy(() => UserUpdateWithoutPatientVisitInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPatientVisitInputSchema) ]).optional(),
}).strict();

export const HospitalUpdateOneRequiredWithoutPatientVisitNestedInputSchema: z.ZodType<Prisma.HospitalUpdateOneRequiredWithoutPatientVisitNestedInput> = z.object({
  create: z.union([ z.lazy(() => HospitalCreateWithoutPatientVisitInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutPatientVisitInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HospitalCreateOrConnectWithoutPatientVisitInputSchema).optional(),
  upsert: z.lazy(() => HospitalUpsertWithoutPatientVisitInputSchema).optional(),
  connect: z.lazy(() => HospitalWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => HospitalUpdateToOneWithWhereWithoutPatientVisitInputSchema),z.lazy(() => HospitalUpdateWithoutPatientVisitInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutPatientVisitInputSchema) ]).optional(),
}).strict();

export const PatientUpdateOneRequiredWithoutPatientVisitNestedInputSchema: z.ZodType<Prisma.PatientUpdateOneRequiredWithoutPatientVisitNestedInput> = z.object({
  create: z.union([ z.lazy(() => PatientCreateWithoutPatientVisitInputSchema),z.lazy(() => PatientUncheckedCreateWithoutPatientVisitInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PatientCreateOrConnectWithoutPatientVisitInputSchema).optional(),
  upsert: z.lazy(() => PatientUpsertWithoutPatientVisitInputSchema).optional(),
  connect: z.lazy(() => PatientWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PatientUpdateToOneWithWhereWithoutPatientVisitInputSchema),z.lazy(() => PatientUpdateWithoutPatientVisitInputSchema),z.lazy(() => PatientUncheckedUpdateWithoutPatientVisitInputSchema) ]).optional(),
}).strict();

export const AssessmentUncheckedUpdateOneWithoutPatientVisitNestedInputSchema: z.ZodType<Prisma.AssessmentUncheckedUpdateOneWithoutPatientVisitNestedInput> = z.object({
  create: z.union([ z.lazy(() => AssessmentCreateWithoutPatientVisitInputSchema),z.lazy(() => AssessmentUncheckedCreateWithoutPatientVisitInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AssessmentCreateOrConnectWithoutPatientVisitInputSchema).optional(),
  upsert: z.lazy(() => AssessmentUpsertWithoutPatientVisitInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AssessmentWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AssessmentWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AssessmentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AssessmentUpdateToOneWithWhereWithoutPatientVisitInputSchema),z.lazy(() => AssessmentUpdateWithoutPatientVisitInputSchema),z.lazy(() => AssessmentUncheckedUpdateWithoutPatientVisitInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutAssessmentInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAssessmentInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAssessmentInputSchema),z.lazy(() => UserUncheckedCreateWithoutAssessmentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAssessmentInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const PatientVisitCreateNestedOneWithoutAssessmentInputSchema: z.ZodType<Prisma.PatientVisitCreateNestedOneWithoutAssessmentInput> = z.object({
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutAssessmentInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutAssessmentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PatientVisitCreateOrConnectWithoutAssessmentInputSchema).optional(),
  connect: z.lazy(() => PatientVisitWhereUniqueInputSchema).optional()
}).strict();

export const PatientCreateNestedOneWithoutAssessmentInputSchema: z.ZodType<Prisma.PatientCreateNestedOneWithoutAssessmentInput> = z.object({
  create: z.union([ z.lazy(() => PatientCreateWithoutAssessmentInputSchema),z.lazy(() => PatientUncheckedCreateWithoutAssessmentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PatientCreateOrConnectWithoutAssessmentInputSchema).optional(),
  connect: z.lazy(() => PatientWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutAssessmentNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAssessmentNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAssessmentInputSchema),z.lazy(() => UserUncheckedCreateWithoutAssessmentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAssessmentInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAssessmentInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAssessmentInputSchema),z.lazy(() => UserUpdateWithoutAssessmentInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAssessmentInputSchema) ]).optional(),
}).strict();

export const PatientVisitUpdateOneRequiredWithoutAssessmentNestedInputSchema: z.ZodType<Prisma.PatientVisitUpdateOneRequiredWithoutAssessmentNestedInput> = z.object({
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutAssessmentInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutAssessmentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PatientVisitCreateOrConnectWithoutAssessmentInputSchema).optional(),
  upsert: z.lazy(() => PatientVisitUpsertWithoutAssessmentInputSchema).optional(),
  connect: z.lazy(() => PatientVisitWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PatientVisitUpdateToOneWithWhereWithoutAssessmentInputSchema),z.lazy(() => PatientVisitUpdateWithoutAssessmentInputSchema),z.lazy(() => PatientVisitUncheckedUpdateWithoutAssessmentInputSchema) ]).optional(),
}).strict();

export const PatientUpdateOneRequiredWithoutAssessmentNestedInputSchema: z.ZodType<Prisma.PatientUpdateOneRequiredWithoutAssessmentNestedInput> = z.object({
  create: z.union([ z.lazy(() => PatientCreateWithoutAssessmentInputSchema),z.lazy(() => PatientUncheckedCreateWithoutAssessmentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PatientCreateOrConnectWithoutAssessmentInputSchema).optional(),
  upsert: z.lazy(() => PatientUpsertWithoutAssessmentInputSchema).optional(),
  connect: z.lazy(() => PatientWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PatientUpdateToOneWithWhereWithoutAssessmentInputSchema),z.lazy(() => PatientUpdateWithoutAssessmentInputSchema),z.lazy(() => PatientUncheckedUpdateWithoutAssessmentInputSchema) ]).optional(),
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedBoolNullableFilterSchema: z.ZodType<Prisma.NestedBoolNullableFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolNullableWithAggregatesFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolNullableFilterSchema).optional()
}).strict();

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const NestedEnumGenderFilterSchema: z.ZodType<Prisma.NestedEnumGenderFilter> = z.object({
  equals: z.lazy(() => GenderSchema).optional(),
  in: z.lazy(() => GenderSchema).array().optional(),
  notIn: z.lazy(() => GenderSchema).array().optional(),
  not: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NestedEnumGenderFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumGenderWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumGenderWithAggregatesFilter> = z.object({
  equals: z.lazy(() => GenderSchema).optional(),
  in: z.lazy(() => GenderSchema).array().optional(),
  notIn: z.lazy(() => GenderSchema).array().optional(),
  not: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NestedEnumGenderWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumGenderFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumGenderFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const DepartmentCreateWithoutHospitalInputSchema: z.ZodType<Prisma.DepartmentCreateWithoutHospitalInput> = z.object({
  name: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Role: z.lazy(() => RoleCreateNestedOneWithoutDepartmentInputSchema),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutDepartmentInputSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentCreateNestedManyWithoutDepartmentInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedManyWithoutDepartmentInputSchema).optional()
}).strict();

export const DepartmentUncheckedCreateWithoutHospitalInputSchema: z.ZodType<Prisma.DepartmentUncheckedCreateWithoutHospitalInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  roleId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutDepartmentInputSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUncheckedCreateNestedManyWithoutDepartmentInputSchema).optional(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutDepartmentInputSchema).optional()
}).strict();

export const DepartmentCreateOrConnectWithoutHospitalInputSchema: z.ZodType<Prisma.DepartmentCreateOrConnectWithoutHospitalInput> = z.object({
  where: z.lazy(() => DepartmentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DepartmentCreateWithoutHospitalInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutHospitalInputSchema) ]),
}).strict();

export const DepartmentCreateManyHospitalInputEnvelopeSchema: z.ZodType<Prisma.DepartmentCreateManyHospitalInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DepartmentCreateManyHospitalInputSchema),z.lazy(() => DepartmentCreateManyHospitalInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const IntentTrackCreateWithoutHospitalInputSchema: z.ZodType<Prisma.IntentTrackCreateWithoutHospitalInput> = z.object({
  color: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  IntentStatus: z.lazy(() => IntentStatusCreateNestedOneWithoutTracksInputSchema),
  ProductIntent: z.lazy(() => ProductIntentCreateNestedManyWithoutTrackInputSchema).optional()
}).strict();

export const IntentTrackUncheckedCreateWithoutHospitalInputSchema: z.ZodType<Prisma.IntentTrackUncheckedCreateWithoutHospitalInput> = z.object({
  id: z.number().int().optional(),
  statusId: z.number().int(),
  color: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedCreateNestedManyWithoutTrackInputSchema).optional()
}).strict();

export const IntentTrackCreateOrConnectWithoutHospitalInputSchema: z.ZodType<Prisma.IntentTrackCreateOrConnectWithoutHospitalInput> = z.object({
  where: z.lazy(() => IntentTrackWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => IntentTrackCreateWithoutHospitalInputSchema),z.lazy(() => IntentTrackUncheckedCreateWithoutHospitalInputSchema) ]),
}).strict();

export const IntentTrackCreateManyHospitalInputEnvelopeSchema: z.ZodType<Prisma.IntentTrackCreateManyHospitalInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => IntentTrackCreateManyHospitalInputSchema),z.lazy(() => IntentTrackCreateManyHospitalInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PatientVisitCreateWithoutHospitalInputSchema: z.ZodType<Prisma.PatientVisitCreateWithoutHospitalInput> = z.object({
  id: z.string().optional(),
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentCreateNestedOneWithoutPatientVisitInputSchema).optional(),
  Department: z.lazy(() => DepartmentCreateNestedOneWithoutPatientVisitInputSchema),
  Doctor: z.lazy(() => UserCreateNestedOneWithoutPatientVisitInputSchema),
  Patient: z.lazy(() => PatientCreateNestedOneWithoutPatientVisitInputSchema)
}).strict();

export const PatientVisitUncheckedCreateWithoutHospitalInputSchema: z.ZodType<Prisma.PatientVisitUncheckedCreateWithoutHospitalInput> = z.object({
  id: z.string().optional(),
  uhid: z.string(),
  departmentId: z.number().int(),
  doctorId: z.string(),
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentUncheckedCreateNestedOneWithoutPatientVisitInputSchema).optional()
}).strict();

export const PatientVisitCreateOrConnectWithoutHospitalInputSchema: z.ZodType<Prisma.PatientVisitCreateOrConnectWithoutHospitalInput> = z.object({
  where: z.lazy(() => PatientVisitWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutHospitalInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutHospitalInputSchema) ]),
}).strict();

export const PatientVisitCreateManyHospitalInputEnvelopeSchema: z.ZodType<Prisma.PatientVisitCreateManyHospitalInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PatientVisitCreateManyHospitalInputSchema),z.lazy(() => PatientVisitCreateManyHospitalInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PermissionCreateWithoutHospitalInputSchema: z.ZodType<Prisma.PermissionCreateWithoutHospitalInput> = z.object({
  permissionName: z.string(),
  description: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  rolePermissions: z.lazy(() => RolePermissionCreateNestedManyWithoutPermissionInputSchema).optional()
}).strict();

export const PermissionUncheckedCreateWithoutHospitalInputSchema: z.ZodType<Prisma.PermissionUncheckedCreateWithoutHospitalInput> = z.object({
  id: z.number().int().optional(),
  permissionName: z.string(),
  description: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  rolePermissions: z.lazy(() => RolePermissionUncheckedCreateNestedManyWithoutPermissionInputSchema).optional()
}).strict();

export const PermissionCreateOrConnectWithoutHospitalInputSchema: z.ZodType<Prisma.PermissionCreateOrConnectWithoutHospitalInput> = z.object({
  where: z.lazy(() => PermissionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PermissionCreateWithoutHospitalInputSchema),z.lazy(() => PermissionUncheckedCreateWithoutHospitalInputSchema) ]),
}).strict();

export const PermissionCreateManyHospitalInputEnvelopeSchema: z.ZodType<Prisma.PermissionCreateManyHospitalInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PermissionCreateManyHospitalInputSchema),z.lazy(() => PermissionCreateManyHospitalInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProductCreateWithoutHospitalInputSchema: z.ZodType<Prisma.ProductCreateWithoutHospitalInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  sku: z.string(),
  hsnCode: z.string(),
  genericName: z.string(),
  brandName: z.string(),
  manufacturer: z.string(),
  dosageForm: z.string(),
  strength: z.string(),
  purchaseRate: z.number(),
  saleRate: z.number(),
  mrp: z.number(),
  maxDiscount: z.number(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentCreateNestedManyWithoutProductInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductUncheckedCreateWithoutHospitalInputSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutHospitalInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  sku: z.string(),
  hsnCode: z.string(),
  genericName: z.string(),
  brandName: z.string(),
  manufacturer: z.string(),
  dosageForm: z.string(),
  strength: z.string(),
  purchaseRate: z.number(),
  saleRate: z.number(),
  mrp: z.number(),
  maxDiscount: z.number(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUncheckedCreateNestedManyWithoutProductInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductCreateOrConnectWithoutHospitalInputSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutHospitalInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductCreateWithoutHospitalInputSchema),z.lazy(() => ProductUncheckedCreateWithoutHospitalInputSchema) ]),
}).strict();

export const ProductCreateManyHospitalInputEnvelopeSchema: z.ZodType<Prisma.ProductCreateManyHospitalInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProductCreateManyHospitalInputSchema),z.lazy(() => ProductCreateManyHospitalInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProductIntentCreateWithoutHospitalInputSchema: z.ZodType<Prisma.ProductIntentCreateWithoutHospitalInput> = z.object({
  id: z.string().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Intent: z.lazy(() => IntentStatusCreateNestedOneWithoutProductIntentInputSchema),
  Product: z.lazy(() => ProductCreateNestedOneWithoutProductIntentInputSchema),
  Track: z.lazy(() => IntentTrackCreateNestedOneWithoutProductIntentInputSchema)
}).strict();

export const ProductIntentUncheckedCreateWithoutHospitalInputSchema: z.ZodType<Prisma.ProductIntentUncheckedCreateWithoutHospitalInput> = z.object({
  id: z.string().optional(),
  productId: z.string(),
  intentId: z.number().int(),
  trackId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductIntentCreateOrConnectWithoutHospitalInputSchema: z.ZodType<Prisma.ProductIntentCreateOrConnectWithoutHospitalInput> = z.object({
  where: z.lazy(() => ProductIntentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutHospitalInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutHospitalInputSchema) ]),
}).strict();

export const ProductIntentCreateManyHospitalInputEnvelopeSchema: z.ZodType<Prisma.ProductIntentCreateManyHospitalInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProductIntentCreateManyHospitalInputSchema),z.lazy(() => ProductIntentCreateManyHospitalInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const RoleCreateWithoutHospitalInputSchema: z.ZodType<Prisma.RoleCreateWithoutHospitalInput> = z.object({
  roleName: z.string(),
  description: z.string().optional().nullable(),
  isSuperAdmin: z.boolean().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentCreateNestedManyWithoutRoleInputSchema).optional(),
  permissions: z.lazy(() => RolePermissionCreateNestedManyWithoutRoleInputSchema).optional(),
  roleUsers: z.lazy(() => UserRoleCreateNestedManyWithoutRoleInputSchema).optional()
}).strict();

export const RoleUncheckedCreateWithoutHospitalInputSchema: z.ZodType<Prisma.RoleUncheckedCreateWithoutHospitalInput> = z.object({
  id: z.number().int().optional(),
  roleName: z.string(),
  description: z.string().optional().nullable(),
  isSuperAdmin: z.boolean().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentUncheckedCreateNestedManyWithoutRoleInputSchema).optional(),
  permissions: z.lazy(() => RolePermissionUncheckedCreateNestedManyWithoutRoleInputSchema).optional(),
  roleUsers: z.lazy(() => UserRoleUncheckedCreateNestedManyWithoutRoleInputSchema).optional()
}).strict();

export const RoleCreateOrConnectWithoutHospitalInputSchema: z.ZodType<Prisma.RoleCreateOrConnectWithoutHospitalInput> = z.object({
  where: z.lazy(() => RoleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RoleCreateWithoutHospitalInputSchema),z.lazy(() => RoleUncheckedCreateWithoutHospitalInputSchema) ]),
}).strict();

export const RoleCreateManyHospitalInputEnvelopeSchema: z.ZodType<Prisma.RoleCreateManyHospitalInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => RoleCreateManyHospitalInputSchema),z.lazy(() => RoleCreateManyHospitalInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserCreateWithoutHospitalInputSchema: z.ZodType<Prisma.UserCreateWithoutHospitalInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  isActive: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentCreateNestedManyWithoutDoctorInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutDoctorInputSchema).optional(),
  Department: z.lazy(() => DepartmentCreateNestedOneWithoutUserInputSchema),
  UserLogin: z.lazy(() => UserLoginCreateNestedOneWithoutUserInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutHospitalInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutHospitalInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  department: z.number().int(),
  isActive: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentUncheckedCreateNestedManyWithoutDoctorInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutDoctorInputSchema).optional(),
  UserLogin: z.lazy(() => UserLoginUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutHospitalInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutHospitalInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutHospitalInputSchema),z.lazy(() => UserUncheckedCreateWithoutHospitalInputSchema) ]),
}).strict();

export const UserCreateManyHospitalInputEnvelopeSchema: z.ZodType<Prisma.UserCreateManyHospitalInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserCreateManyHospitalInputSchema),z.lazy(() => UserCreateManyHospitalInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const VendorCreateWithoutHospitalInputSchema: z.ZodType<Prisma.VendorCreateWithoutHospitalInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  address: z.string(),
  gstNumber: z.string(),
  branchName: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const VendorUncheckedCreateWithoutHospitalInputSchema: z.ZodType<Prisma.VendorUncheckedCreateWithoutHospitalInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  address: z.string(),
  gstNumber: z.string(),
  branchName: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const VendorCreateOrConnectWithoutHospitalInputSchema: z.ZodType<Prisma.VendorCreateOrConnectWithoutHospitalInput> = z.object({
  where: z.lazy(() => VendorWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => VendorCreateWithoutHospitalInputSchema),z.lazy(() => VendorUncheckedCreateWithoutHospitalInputSchema) ]),
}).strict();

export const VendorCreateManyHospitalInputEnvelopeSchema: z.ZodType<Prisma.VendorCreateManyHospitalInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => VendorCreateManyHospitalInputSchema),z.lazy(() => VendorCreateManyHospitalInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DepartmentUpsertWithWhereUniqueWithoutHospitalInputSchema: z.ZodType<Prisma.DepartmentUpsertWithWhereUniqueWithoutHospitalInput> = z.object({
  where: z.lazy(() => DepartmentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DepartmentUpdateWithoutHospitalInputSchema),z.lazy(() => DepartmentUncheckedUpdateWithoutHospitalInputSchema) ]),
  create: z.union([ z.lazy(() => DepartmentCreateWithoutHospitalInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutHospitalInputSchema) ]),
}).strict();

export const DepartmentUpdateWithWhereUniqueWithoutHospitalInputSchema: z.ZodType<Prisma.DepartmentUpdateWithWhereUniqueWithoutHospitalInput> = z.object({
  where: z.lazy(() => DepartmentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DepartmentUpdateWithoutHospitalInputSchema),z.lazy(() => DepartmentUncheckedUpdateWithoutHospitalInputSchema) ]),
}).strict();

export const DepartmentUpdateManyWithWhereWithoutHospitalInputSchema: z.ZodType<Prisma.DepartmentUpdateManyWithWhereWithoutHospitalInput> = z.object({
  where: z.lazy(() => DepartmentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DepartmentUpdateManyMutationInputSchema),z.lazy(() => DepartmentUncheckedUpdateManyWithoutHospitalInputSchema) ]),
}).strict();

export const DepartmentScalarWhereInputSchema: z.ZodType<Prisma.DepartmentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DepartmentScalarWhereInputSchema),z.lazy(() => DepartmentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DepartmentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DepartmentScalarWhereInputSchema),z.lazy(() => DepartmentScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  roleId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const IntentTrackUpsertWithWhereUniqueWithoutHospitalInputSchema: z.ZodType<Prisma.IntentTrackUpsertWithWhereUniqueWithoutHospitalInput> = z.object({
  where: z.lazy(() => IntentTrackWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => IntentTrackUpdateWithoutHospitalInputSchema),z.lazy(() => IntentTrackUncheckedUpdateWithoutHospitalInputSchema) ]),
  create: z.union([ z.lazy(() => IntentTrackCreateWithoutHospitalInputSchema),z.lazy(() => IntentTrackUncheckedCreateWithoutHospitalInputSchema) ]),
}).strict();

export const IntentTrackUpdateWithWhereUniqueWithoutHospitalInputSchema: z.ZodType<Prisma.IntentTrackUpdateWithWhereUniqueWithoutHospitalInput> = z.object({
  where: z.lazy(() => IntentTrackWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => IntentTrackUpdateWithoutHospitalInputSchema),z.lazy(() => IntentTrackUncheckedUpdateWithoutHospitalInputSchema) ]),
}).strict();

export const IntentTrackUpdateManyWithWhereWithoutHospitalInputSchema: z.ZodType<Prisma.IntentTrackUpdateManyWithWhereWithoutHospitalInput> = z.object({
  where: z.lazy(() => IntentTrackScalarWhereInputSchema),
  data: z.union([ z.lazy(() => IntentTrackUpdateManyMutationInputSchema),z.lazy(() => IntentTrackUncheckedUpdateManyWithoutHospitalInputSchema) ]),
}).strict();

export const IntentTrackScalarWhereInputSchema: z.ZodType<Prisma.IntentTrackScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => IntentTrackScalarWhereInputSchema),z.lazy(() => IntentTrackScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => IntentTrackScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => IntentTrackScalarWhereInputSchema),z.lazy(() => IntentTrackScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  statusId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  color: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PatientVisitUpsertWithWhereUniqueWithoutHospitalInputSchema: z.ZodType<Prisma.PatientVisitUpsertWithWhereUniqueWithoutHospitalInput> = z.object({
  where: z.lazy(() => PatientVisitWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PatientVisitUpdateWithoutHospitalInputSchema),z.lazy(() => PatientVisitUncheckedUpdateWithoutHospitalInputSchema) ]),
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutHospitalInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutHospitalInputSchema) ]),
}).strict();

export const PatientVisitUpdateWithWhereUniqueWithoutHospitalInputSchema: z.ZodType<Prisma.PatientVisitUpdateWithWhereUniqueWithoutHospitalInput> = z.object({
  where: z.lazy(() => PatientVisitWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PatientVisitUpdateWithoutHospitalInputSchema),z.lazy(() => PatientVisitUncheckedUpdateWithoutHospitalInputSchema) ]),
}).strict();

export const PatientVisitUpdateManyWithWhereWithoutHospitalInputSchema: z.ZodType<Prisma.PatientVisitUpdateManyWithWhereWithoutHospitalInput> = z.object({
  where: z.lazy(() => PatientVisitScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PatientVisitUpdateManyMutationInputSchema),z.lazy(() => PatientVisitUncheckedUpdateManyWithoutHospitalInputSchema) ]),
}).strict();

export const PatientVisitScalarWhereInputSchema: z.ZodType<Prisma.PatientVisitScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PatientVisitScalarWhereInputSchema),z.lazy(() => PatientVisitScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PatientVisitScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PatientVisitScalarWhereInputSchema),z.lazy(() => PatientVisitScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  uhid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  departmentId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  doctorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  checkInTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  checkOutTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  isDeleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PermissionUpsertWithWhereUniqueWithoutHospitalInputSchema: z.ZodType<Prisma.PermissionUpsertWithWhereUniqueWithoutHospitalInput> = z.object({
  where: z.lazy(() => PermissionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PermissionUpdateWithoutHospitalInputSchema),z.lazy(() => PermissionUncheckedUpdateWithoutHospitalInputSchema) ]),
  create: z.union([ z.lazy(() => PermissionCreateWithoutHospitalInputSchema),z.lazy(() => PermissionUncheckedCreateWithoutHospitalInputSchema) ]),
}).strict();

export const PermissionUpdateWithWhereUniqueWithoutHospitalInputSchema: z.ZodType<Prisma.PermissionUpdateWithWhereUniqueWithoutHospitalInput> = z.object({
  where: z.lazy(() => PermissionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PermissionUpdateWithoutHospitalInputSchema),z.lazy(() => PermissionUncheckedUpdateWithoutHospitalInputSchema) ]),
}).strict();

export const PermissionUpdateManyWithWhereWithoutHospitalInputSchema: z.ZodType<Prisma.PermissionUpdateManyWithWhereWithoutHospitalInput> = z.object({
  where: z.lazy(() => PermissionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PermissionUpdateManyMutationInputSchema),z.lazy(() => PermissionUncheckedUpdateManyWithoutHospitalInputSchema) ]),
}).strict();

export const PermissionScalarWhereInputSchema: z.ZodType<Prisma.PermissionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PermissionScalarWhereInputSchema),z.lazy(() => PermissionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PermissionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PermissionScalarWhereInputSchema),z.lazy(() => PermissionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  permissionName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ProductUpsertWithWhereUniqueWithoutHospitalInputSchema: z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutHospitalInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProductUpdateWithoutHospitalInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutHospitalInputSchema) ]),
  create: z.union([ z.lazy(() => ProductCreateWithoutHospitalInputSchema),z.lazy(() => ProductUncheckedCreateWithoutHospitalInputSchema) ]),
}).strict();

export const ProductUpdateWithWhereUniqueWithoutHospitalInputSchema: z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutHospitalInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProductUpdateWithoutHospitalInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutHospitalInputSchema) ]),
}).strict();

export const ProductUpdateManyWithWhereWithoutHospitalInputSchema: z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutHospitalInput> = z.object({
  where: z.lazy(() => ProductScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProductUpdateManyMutationInputSchema),z.lazy(() => ProductUncheckedUpdateManyWithoutHospitalInputSchema) ]),
}).strict();

export const ProductScalarWhereInputSchema: z.ZodType<Prisma.ProductScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sku: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  hsnCode: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  genericName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  brandName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  manufacturer: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  dosageForm: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  strength: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  purchaseRate: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  saleRate: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  mrp: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  maxDiscount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ProductIntentUpsertWithWhereUniqueWithoutHospitalInputSchema: z.ZodType<Prisma.ProductIntentUpsertWithWhereUniqueWithoutHospitalInput> = z.object({
  where: z.lazy(() => ProductIntentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProductIntentUpdateWithoutHospitalInputSchema),z.lazy(() => ProductIntentUncheckedUpdateWithoutHospitalInputSchema) ]),
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutHospitalInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutHospitalInputSchema) ]),
}).strict();

export const ProductIntentUpdateWithWhereUniqueWithoutHospitalInputSchema: z.ZodType<Prisma.ProductIntentUpdateWithWhereUniqueWithoutHospitalInput> = z.object({
  where: z.lazy(() => ProductIntentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProductIntentUpdateWithoutHospitalInputSchema),z.lazy(() => ProductIntentUncheckedUpdateWithoutHospitalInputSchema) ]),
}).strict();

export const ProductIntentUpdateManyWithWhereWithoutHospitalInputSchema: z.ZodType<Prisma.ProductIntentUpdateManyWithWhereWithoutHospitalInput> = z.object({
  where: z.lazy(() => ProductIntentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProductIntentUpdateManyMutationInputSchema),z.lazy(() => ProductIntentUncheckedUpdateManyWithoutHospitalInputSchema) ]),
}).strict();

export const ProductIntentScalarWhereInputSchema: z.ZodType<Prisma.ProductIntentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProductIntentScalarWhereInputSchema),z.lazy(() => ProductIntentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductIntentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductIntentScalarWhereInputSchema),z.lazy(() => ProductIntentScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  productId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  intentId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  trackId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const RoleUpsertWithWhereUniqueWithoutHospitalInputSchema: z.ZodType<Prisma.RoleUpsertWithWhereUniqueWithoutHospitalInput> = z.object({
  where: z.lazy(() => RoleWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => RoleUpdateWithoutHospitalInputSchema),z.lazy(() => RoleUncheckedUpdateWithoutHospitalInputSchema) ]),
  create: z.union([ z.lazy(() => RoleCreateWithoutHospitalInputSchema),z.lazy(() => RoleUncheckedCreateWithoutHospitalInputSchema) ]),
}).strict();

export const RoleUpdateWithWhereUniqueWithoutHospitalInputSchema: z.ZodType<Prisma.RoleUpdateWithWhereUniqueWithoutHospitalInput> = z.object({
  where: z.lazy(() => RoleWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => RoleUpdateWithoutHospitalInputSchema),z.lazy(() => RoleUncheckedUpdateWithoutHospitalInputSchema) ]),
}).strict();

export const RoleUpdateManyWithWhereWithoutHospitalInputSchema: z.ZodType<Prisma.RoleUpdateManyWithWhereWithoutHospitalInput> = z.object({
  where: z.lazy(() => RoleScalarWhereInputSchema),
  data: z.union([ z.lazy(() => RoleUpdateManyMutationInputSchema),z.lazy(() => RoleUncheckedUpdateManyWithoutHospitalInputSchema) ]),
}).strict();

export const RoleScalarWhereInputSchema: z.ZodType<Prisma.RoleScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RoleScalarWhereInputSchema),z.lazy(() => RoleScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoleScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoleScalarWhereInputSchema),z.lazy(() => RoleScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  roleName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  isSuperAdmin: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserUpsertWithWhereUniqueWithoutHospitalInputSchema: z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutHospitalInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserUpdateWithoutHospitalInputSchema),z.lazy(() => UserUncheckedUpdateWithoutHospitalInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutHospitalInputSchema),z.lazy(() => UserUncheckedCreateWithoutHospitalInputSchema) ]),
}).strict();

export const UserUpdateWithWhereUniqueWithoutHospitalInputSchema: z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutHospitalInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserUpdateWithoutHospitalInputSchema),z.lazy(() => UserUncheckedUpdateWithoutHospitalInputSchema) ]),
}).strict();

export const UserUpdateManyWithWhereWithoutHospitalInputSchema: z.ZodType<Prisma.UserUpdateManyWithWhereWithoutHospitalInput> = z.object({
  where: z.lazy(() => UserScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserUpdateManyMutationInputSchema),z.lazy(() => UserUncheckedUpdateManyWithoutHospitalInputSchema) ]),
}).strict();

export const UserScalarWhereInputSchema: z.ZodType<Prisma.UserScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  department: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  isActive: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const VendorUpsertWithWhereUniqueWithoutHospitalInputSchema: z.ZodType<Prisma.VendorUpsertWithWhereUniqueWithoutHospitalInput> = z.object({
  where: z.lazy(() => VendorWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => VendorUpdateWithoutHospitalInputSchema),z.lazy(() => VendorUncheckedUpdateWithoutHospitalInputSchema) ]),
  create: z.union([ z.lazy(() => VendorCreateWithoutHospitalInputSchema),z.lazy(() => VendorUncheckedCreateWithoutHospitalInputSchema) ]),
}).strict();

export const VendorUpdateWithWhereUniqueWithoutHospitalInputSchema: z.ZodType<Prisma.VendorUpdateWithWhereUniqueWithoutHospitalInput> = z.object({
  where: z.lazy(() => VendorWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => VendorUpdateWithoutHospitalInputSchema),z.lazy(() => VendorUncheckedUpdateWithoutHospitalInputSchema) ]),
}).strict();

export const VendorUpdateManyWithWhereWithoutHospitalInputSchema: z.ZodType<Prisma.VendorUpdateManyWithWhereWithoutHospitalInput> = z.object({
  where: z.lazy(() => VendorScalarWhereInputSchema),
  data: z.union([ z.lazy(() => VendorUpdateManyMutationInputSchema),z.lazy(() => VendorUncheckedUpdateManyWithoutHospitalInputSchema) ]),
}).strict();

export const VendorScalarWhereInputSchema: z.ZodType<Prisma.VendorScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => VendorScalarWhereInputSchema),z.lazy(() => VendorScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VendorScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VendorScalarWhereInputSchema),z.lazy(() => VendorScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phoneNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  gstNumber: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  branchName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  hospitalId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const HospitalCreateWithoutDepartmentInputSchema: z.ZodType<Prisma.HospitalCreateWithoutDepartmentInput> = z.object({
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  IntentTrack: z.lazy(() => IntentTrackCreateNestedManyWithoutHospitalInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutHospitalInputSchema).optional(),
  Permission: z.lazy(() => PermissionCreateNestedManyWithoutHospitalInputSchema).optional(),
  Product: z.lazy(() => ProductCreateNestedManyWithoutHospitalInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentCreateNestedManyWithoutHospitalInputSchema).optional(),
  Role: z.lazy(() => RoleCreateNestedManyWithoutHospitalInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedManyWithoutHospitalInputSchema).optional(),
  Vendor: z.lazy(() => VendorCreateNestedManyWithoutHospitalInputSchema).optional()
}).strict();

export const HospitalUncheckedCreateWithoutDepartmentInputSchema: z.ZodType<Prisma.HospitalUncheckedCreateWithoutDepartmentInput> = z.object({
  id: z.number().int().optional(),
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  IntentTrack: z.lazy(() => IntentTrackUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Permission: z.lazy(() => PermissionUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Role: z.lazy(() => RoleUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Vendor: z.lazy(() => VendorUncheckedCreateNestedManyWithoutHospitalInputSchema).optional()
}).strict();

export const HospitalCreateOrConnectWithoutDepartmentInputSchema: z.ZodType<Prisma.HospitalCreateOrConnectWithoutDepartmentInput> = z.object({
  where: z.lazy(() => HospitalWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => HospitalCreateWithoutDepartmentInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutDepartmentInputSchema) ]),
}).strict();

export const RoleCreateWithoutDepartmentInputSchema: z.ZodType<Prisma.RoleCreateWithoutDepartmentInput> = z.object({
  roleName: z.string(),
  description: z.string().optional().nullable(),
  isSuperAdmin: z.boolean().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutRoleInputSchema),
  permissions: z.lazy(() => RolePermissionCreateNestedManyWithoutRoleInputSchema).optional(),
  roleUsers: z.lazy(() => UserRoleCreateNestedManyWithoutRoleInputSchema).optional()
}).strict();

export const RoleUncheckedCreateWithoutDepartmentInputSchema: z.ZodType<Prisma.RoleUncheckedCreateWithoutDepartmentInput> = z.object({
  id: z.number().int().optional(),
  roleName: z.string(),
  description: z.string().optional().nullable(),
  hospitalId: z.number().int(),
  isSuperAdmin: z.boolean().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  permissions: z.lazy(() => RolePermissionUncheckedCreateNestedManyWithoutRoleInputSchema).optional(),
  roleUsers: z.lazy(() => UserRoleUncheckedCreateNestedManyWithoutRoleInputSchema).optional()
}).strict();

export const RoleCreateOrConnectWithoutDepartmentInputSchema: z.ZodType<Prisma.RoleCreateOrConnectWithoutDepartmentInput> = z.object({
  where: z.lazy(() => RoleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RoleCreateWithoutDepartmentInputSchema),z.lazy(() => RoleUncheckedCreateWithoutDepartmentInputSchema) ]),
}).strict();

export const PatientVisitCreateWithoutDepartmentInputSchema: z.ZodType<Prisma.PatientVisitCreateWithoutDepartmentInput> = z.object({
  id: z.string().optional(),
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentCreateNestedOneWithoutPatientVisitInputSchema).optional(),
  Doctor: z.lazy(() => UserCreateNestedOneWithoutPatientVisitInputSchema),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutPatientVisitInputSchema),
  Patient: z.lazy(() => PatientCreateNestedOneWithoutPatientVisitInputSchema)
}).strict();

export const PatientVisitUncheckedCreateWithoutDepartmentInputSchema: z.ZodType<Prisma.PatientVisitUncheckedCreateWithoutDepartmentInput> = z.object({
  id: z.string().optional(),
  uhid: z.string(),
  hospitalId: z.number().int(),
  doctorId: z.string(),
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentUncheckedCreateNestedOneWithoutPatientVisitInputSchema).optional()
}).strict();

export const PatientVisitCreateOrConnectWithoutDepartmentInputSchema: z.ZodType<Prisma.PatientVisitCreateOrConnectWithoutDepartmentInput> = z.object({
  where: z.lazy(() => PatientVisitWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutDepartmentInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutDepartmentInputSchema) ]),
}).strict();

export const PatientVisitCreateManyDepartmentInputEnvelopeSchema: z.ZodType<Prisma.PatientVisitCreateManyDepartmentInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PatientVisitCreateManyDepartmentInputSchema),z.lazy(() => PatientVisitCreateManyDepartmentInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProductDepartmentCreateWithoutDepartmentInputSchema: z.ZodType<Prisma.ProductDepartmentCreateWithoutDepartmentInput> = z.object({
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Product: z.lazy(() => ProductCreateNestedOneWithoutProductDepartmentInputSchema)
}).strict();

export const ProductDepartmentUncheckedCreateWithoutDepartmentInputSchema: z.ZodType<Prisma.ProductDepartmentUncheckedCreateWithoutDepartmentInput> = z.object({
  id: z.number().int().optional(),
  productId: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductDepartmentCreateOrConnectWithoutDepartmentInputSchema: z.ZodType<Prisma.ProductDepartmentCreateOrConnectWithoutDepartmentInput> = z.object({
  where: z.lazy(() => ProductDepartmentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductDepartmentCreateWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentUncheckedCreateWithoutDepartmentInputSchema) ]),
}).strict();

export const ProductDepartmentCreateManyDepartmentInputEnvelopeSchema: z.ZodType<Prisma.ProductDepartmentCreateManyDepartmentInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProductDepartmentCreateManyDepartmentInputSchema),z.lazy(() => ProductDepartmentCreateManyDepartmentInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserCreateWithoutDepartmentInputSchema: z.ZodType<Prisma.UserCreateWithoutDepartmentInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  isActive: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentCreateNestedManyWithoutDoctorInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutDoctorInputSchema).optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutUserInputSchema),
  UserLogin: z.lazy(() => UserLoginCreateNestedOneWithoutUserInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutDepartmentInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutDepartmentInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  hospitalId: z.number().int(),
  isActive: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentUncheckedCreateNestedManyWithoutDoctorInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutDoctorInputSchema).optional(),
  UserLogin: z.lazy(() => UserLoginUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutDepartmentInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutDepartmentInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutDepartmentInputSchema),z.lazy(() => UserUncheckedCreateWithoutDepartmentInputSchema) ]),
}).strict();

export const UserCreateManyDepartmentInputEnvelopeSchema: z.ZodType<Prisma.UserCreateManyDepartmentInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserCreateManyDepartmentInputSchema),z.lazy(() => UserCreateManyDepartmentInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const HospitalUpsertWithoutDepartmentInputSchema: z.ZodType<Prisma.HospitalUpsertWithoutDepartmentInput> = z.object({
  update: z.union([ z.lazy(() => HospitalUpdateWithoutDepartmentInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutDepartmentInputSchema) ]),
  create: z.union([ z.lazy(() => HospitalCreateWithoutDepartmentInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutDepartmentInputSchema) ]),
  where: z.lazy(() => HospitalWhereInputSchema).optional()
}).strict();

export const HospitalUpdateToOneWithWhereWithoutDepartmentInputSchema: z.ZodType<Prisma.HospitalUpdateToOneWithWhereWithoutDepartmentInput> = z.object({
  where: z.lazy(() => HospitalWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => HospitalUpdateWithoutDepartmentInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutDepartmentInputSchema) ]),
}).strict();

export const HospitalUpdateWithoutDepartmentInputSchema: z.ZodType<Prisma.HospitalUpdateWithoutDepartmentInput> = z.object({
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  IntentTrack: z.lazy(() => IntentTrackUpdateManyWithoutHospitalNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Permission: z.lazy(() => PermissionUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUpdateManyWithoutHospitalNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUpdateManyWithoutHospitalNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Vendor: z.lazy(() => VendorUpdateManyWithoutHospitalNestedInputSchema).optional()
}).strict();

export const HospitalUncheckedUpdateWithoutDepartmentInputSchema: z.ZodType<Prisma.HospitalUncheckedUpdateWithoutDepartmentInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  IntentTrack: z.lazy(() => IntentTrackUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Permission: z.lazy(() => PermissionUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Vendor: z.lazy(() => VendorUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional()
}).strict();

export const RoleUpsertWithoutDepartmentInputSchema: z.ZodType<Prisma.RoleUpsertWithoutDepartmentInput> = z.object({
  update: z.union([ z.lazy(() => RoleUpdateWithoutDepartmentInputSchema),z.lazy(() => RoleUncheckedUpdateWithoutDepartmentInputSchema) ]),
  create: z.union([ z.lazy(() => RoleCreateWithoutDepartmentInputSchema),z.lazy(() => RoleUncheckedCreateWithoutDepartmentInputSchema) ]),
  where: z.lazy(() => RoleWhereInputSchema).optional()
}).strict();

export const RoleUpdateToOneWithWhereWithoutDepartmentInputSchema: z.ZodType<Prisma.RoleUpdateToOneWithWhereWithoutDepartmentInput> = z.object({
  where: z.lazy(() => RoleWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => RoleUpdateWithoutDepartmentInputSchema),z.lazy(() => RoleUncheckedUpdateWithoutDepartmentInputSchema) ]),
}).strict();

export const RoleUpdateWithoutDepartmentInputSchema: z.ZodType<Prisma.RoleUpdateWithoutDepartmentInput> = z.object({
  roleName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isSuperAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutRoleNestedInputSchema).optional(),
  permissions: z.lazy(() => RolePermissionUpdateManyWithoutRoleNestedInputSchema).optional(),
  roleUsers: z.lazy(() => UserRoleUpdateManyWithoutRoleNestedInputSchema).optional()
}).strict();

export const RoleUncheckedUpdateWithoutDepartmentInputSchema: z.ZodType<Prisma.RoleUncheckedUpdateWithoutDepartmentInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  roleName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isSuperAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  permissions: z.lazy(() => RolePermissionUncheckedUpdateManyWithoutRoleNestedInputSchema).optional(),
  roleUsers: z.lazy(() => UserRoleUncheckedUpdateManyWithoutRoleNestedInputSchema).optional()
}).strict();

export const PatientVisitUpsertWithWhereUniqueWithoutDepartmentInputSchema: z.ZodType<Prisma.PatientVisitUpsertWithWhereUniqueWithoutDepartmentInput> = z.object({
  where: z.lazy(() => PatientVisitWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PatientVisitUpdateWithoutDepartmentInputSchema),z.lazy(() => PatientVisitUncheckedUpdateWithoutDepartmentInputSchema) ]),
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutDepartmentInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutDepartmentInputSchema) ]),
}).strict();

export const PatientVisitUpdateWithWhereUniqueWithoutDepartmentInputSchema: z.ZodType<Prisma.PatientVisitUpdateWithWhereUniqueWithoutDepartmentInput> = z.object({
  where: z.lazy(() => PatientVisitWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PatientVisitUpdateWithoutDepartmentInputSchema),z.lazy(() => PatientVisitUncheckedUpdateWithoutDepartmentInputSchema) ]),
}).strict();

export const PatientVisitUpdateManyWithWhereWithoutDepartmentInputSchema: z.ZodType<Prisma.PatientVisitUpdateManyWithWhereWithoutDepartmentInput> = z.object({
  where: z.lazy(() => PatientVisitScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PatientVisitUpdateManyMutationInputSchema),z.lazy(() => PatientVisitUncheckedUpdateManyWithoutDepartmentInputSchema) ]),
}).strict();

export const ProductDepartmentUpsertWithWhereUniqueWithoutDepartmentInputSchema: z.ZodType<Prisma.ProductDepartmentUpsertWithWhereUniqueWithoutDepartmentInput> = z.object({
  where: z.lazy(() => ProductDepartmentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProductDepartmentUpdateWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentUncheckedUpdateWithoutDepartmentInputSchema) ]),
  create: z.union([ z.lazy(() => ProductDepartmentCreateWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentUncheckedCreateWithoutDepartmentInputSchema) ]),
}).strict();

export const ProductDepartmentUpdateWithWhereUniqueWithoutDepartmentInputSchema: z.ZodType<Prisma.ProductDepartmentUpdateWithWhereUniqueWithoutDepartmentInput> = z.object({
  where: z.lazy(() => ProductDepartmentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProductDepartmentUpdateWithoutDepartmentInputSchema),z.lazy(() => ProductDepartmentUncheckedUpdateWithoutDepartmentInputSchema) ]),
}).strict();

export const ProductDepartmentUpdateManyWithWhereWithoutDepartmentInputSchema: z.ZodType<Prisma.ProductDepartmentUpdateManyWithWhereWithoutDepartmentInput> = z.object({
  where: z.lazy(() => ProductDepartmentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProductDepartmentUpdateManyMutationInputSchema),z.lazy(() => ProductDepartmentUncheckedUpdateManyWithoutDepartmentInputSchema) ]),
}).strict();

export const ProductDepartmentScalarWhereInputSchema: z.ZodType<Prisma.ProductDepartmentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProductDepartmentScalarWhereInputSchema),z.lazy(() => ProductDepartmentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductDepartmentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductDepartmentScalarWhereInputSchema),z.lazy(() => ProductDepartmentScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  productId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  departmentId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserUpsertWithWhereUniqueWithoutDepartmentInputSchema: z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutDepartmentInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserUpdateWithoutDepartmentInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDepartmentInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutDepartmentInputSchema),z.lazy(() => UserUncheckedCreateWithoutDepartmentInputSchema) ]),
}).strict();

export const UserUpdateWithWhereUniqueWithoutDepartmentInputSchema: z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutDepartmentInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserUpdateWithoutDepartmentInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDepartmentInputSchema) ]),
}).strict();

export const UserUpdateManyWithWhereWithoutDepartmentInputSchema: z.ZodType<Prisma.UserUpdateManyWithWhereWithoutDepartmentInput> = z.object({
  where: z.lazy(() => UserScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserUpdateManyMutationInputSchema),z.lazy(() => UserUncheckedUpdateManyWithoutDepartmentInputSchema) ]),
}).strict();

export const AssessmentCreateWithoutDoctorInputSchema: z.ZodType<Prisma.AssessmentCreateWithoutDoctorInput> = z.object({
  id: z.string().optional(),
  complaint: z.string(),
  currentMedication: z.string(),
  pastMedicalHistory: z.string(),
  examination: z.string(),
  investigation: z.string(),
  procedureDone: z.string(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  treatmentGiven: z.string(),
  followUp: z.coerce.date(),
  followupInstruction: z.string(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedOneWithoutAssessmentInputSchema),
  Patient: z.lazy(() => PatientCreateNestedOneWithoutAssessmentInputSchema)
}).strict();

export const AssessmentUncheckedCreateWithoutDoctorInputSchema: z.ZodType<Prisma.AssessmentUncheckedCreateWithoutDoctorInput> = z.object({
  id: z.string().optional(),
  uhid: z.string(),
  patientVisitId: z.string(),
  complaint: z.string(),
  currentMedication: z.string(),
  pastMedicalHistory: z.string(),
  examination: z.string(),
  investigation: z.string(),
  procedureDone: z.string(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  treatmentGiven: z.string(),
  followUp: z.coerce.date(),
  followupInstruction: z.string(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AssessmentCreateOrConnectWithoutDoctorInputSchema: z.ZodType<Prisma.AssessmentCreateOrConnectWithoutDoctorInput> = z.object({
  where: z.lazy(() => AssessmentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AssessmentCreateWithoutDoctorInputSchema),z.lazy(() => AssessmentUncheckedCreateWithoutDoctorInputSchema) ]),
}).strict();

export const AssessmentCreateManyDoctorInputEnvelopeSchema: z.ZodType<Prisma.AssessmentCreateManyDoctorInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AssessmentCreateManyDoctorInputSchema),z.lazy(() => AssessmentCreateManyDoctorInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PatientVisitCreateWithoutDoctorInputSchema: z.ZodType<Prisma.PatientVisitCreateWithoutDoctorInput> = z.object({
  id: z.string().optional(),
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentCreateNestedOneWithoutPatientVisitInputSchema).optional(),
  Department: z.lazy(() => DepartmentCreateNestedOneWithoutPatientVisitInputSchema),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutPatientVisitInputSchema),
  Patient: z.lazy(() => PatientCreateNestedOneWithoutPatientVisitInputSchema)
}).strict();

export const PatientVisitUncheckedCreateWithoutDoctorInputSchema: z.ZodType<Prisma.PatientVisitUncheckedCreateWithoutDoctorInput> = z.object({
  id: z.string().optional(),
  uhid: z.string(),
  hospitalId: z.number().int(),
  departmentId: z.number().int(),
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentUncheckedCreateNestedOneWithoutPatientVisitInputSchema).optional()
}).strict();

export const PatientVisitCreateOrConnectWithoutDoctorInputSchema: z.ZodType<Prisma.PatientVisitCreateOrConnectWithoutDoctorInput> = z.object({
  where: z.lazy(() => PatientVisitWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutDoctorInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutDoctorInputSchema) ]),
}).strict();

export const PatientVisitCreateManyDoctorInputEnvelopeSchema: z.ZodType<Prisma.PatientVisitCreateManyDoctorInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PatientVisitCreateManyDoctorInputSchema),z.lazy(() => PatientVisitCreateManyDoctorInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DepartmentCreateWithoutUserInputSchema: z.ZodType<Prisma.DepartmentCreateWithoutUserInput> = z.object({
  name: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutDepartmentInputSchema),
  Role: z.lazy(() => RoleCreateNestedOneWithoutDepartmentInputSchema),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutDepartmentInputSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentCreateNestedManyWithoutDepartmentInputSchema).optional()
}).strict();

export const DepartmentUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.DepartmentUncheckedCreateWithoutUserInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  hospitalId: z.number().int(),
  roleId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutDepartmentInputSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUncheckedCreateNestedManyWithoutDepartmentInputSchema).optional()
}).strict();

export const DepartmentCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.DepartmentCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => DepartmentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DepartmentCreateWithoutUserInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const HospitalCreateWithoutUserInputSchema: z.ZodType<Prisma.HospitalCreateWithoutUserInput> = z.object({
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentCreateNestedManyWithoutHospitalInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackCreateNestedManyWithoutHospitalInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutHospitalInputSchema).optional(),
  Permission: z.lazy(() => PermissionCreateNestedManyWithoutHospitalInputSchema).optional(),
  Product: z.lazy(() => ProductCreateNestedManyWithoutHospitalInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentCreateNestedManyWithoutHospitalInputSchema).optional(),
  Role: z.lazy(() => RoleCreateNestedManyWithoutHospitalInputSchema).optional(),
  Vendor: z.lazy(() => VendorCreateNestedManyWithoutHospitalInputSchema).optional()
}).strict();

export const HospitalUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.HospitalUncheckedCreateWithoutUserInput> = z.object({
  id: z.number().int().optional(),
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Permission: z.lazy(() => PermissionUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Role: z.lazy(() => RoleUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Vendor: z.lazy(() => VendorUncheckedCreateNestedManyWithoutHospitalInputSchema).optional()
}).strict();

export const HospitalCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.HospitalCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => HospitalWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => HospitalCreateWithoutUserInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UserLoginCreateWithoutUserInputSchema: z.ZodType<Prisma.UserLoginCreateWithoutUserInput> = z.object({
  password: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserLoginUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.UserLoginUncheckedCreateWithoutUserInput> = z.object({
  password: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserLoginCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.UserLoginCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => UserLoginWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserLoginCreateWithoutUserInputSchema),z.lazy(() => UserLoginUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UserRoleCreateWithoutUserInputSchema: z.ZodType<Prisma.UserRoleCreateWithoutUserInput> = z.object({
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  role: z.lazy(() => RoleCreateNestedOneWithoutRoleUsersInputSchema)
}).strict();

export const UserRoleUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.UserRoleUncheckedCreateWithoutUserInput> = z.object({
  id: z.number().int().optional(),
  roleId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserRoleCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.UserRoleCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => UserRoleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserRoleCreateWithoutUserInputSchema),z.lazy(() => UserRoleUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UserRoleCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.UserRoleCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserRoleCreateManyUserInputSchema),z.lazy(() => UserRoleCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AssessmentUpsertWithWhereUniqueWithoutDoctorInputSchema: z.ZodType<Prisma.AssessmentUpsertWithWhereUniqueWithoutDoctorInput> = z.object({
  where: z.lazy(() => AssessmentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AssessmentUpdateWithoutDoctorInputSchema),z.lazy(() => AssessmentUncheckedUpdateWithoutDoctorInputSchema) ]),
  create: z.union([ z.lazy(() => AssessmentCreateWithoutDoctorInputSchema),z.lazy(() => AssessmentUncheckedCreateWithoutDoctorInputSchema) ]),
}).strict();

export const AssessmentUpdateWithWhereUniqueWithoutDoctorInputSchema: z.ZodType<Prisma.AssessmentUpdateWithWhereUniqueWithoutDoctorInput> = z.object({
  where: z.lazy(() => AssessmentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AssessmentUpdateWithoutDoctorInputSchema),z.lazy(() => AssessmentUncheckedUpdateWithoutDoctorInputSchema) ]),
}).strict();

export const AssessmentUpdateManyWithWhereWithoutDoctorInputSchema: z.ZodType<Prisma.AssessmentUpdateManyWithWhereWithoutDoctorInput> = z.object({
  where: z.lazy(() => AssessmentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AssessmentUpdateManyMutationInputSchema),z.lazy(() => AssessmentUncheckedUpdateManyWithoutDoctorInputSchema) ]),
}).strict();

export const AssessmentScalarWhereInputSchema: z.ZodType<Prisma.AssessmentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AssessmentScalarWhereInputSchema),z.lazy(() => AssessmentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AssessmentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AssessmentScalarWhereInputSchema),z.lazy(() => AssessmentScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  uhid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  doctorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  patientVisitId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  complaint: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  currentMedication: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  pastMedicalHistory: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  examination: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  investigation: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  procedureDone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  diagnosis: z.lazy(() => JsonFilterSchema).optional(),
  treatmentGiven: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  followUp: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  followupInstruction: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isDeleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PatientVisitUpsertWithWhereUniqueWithoutDoctorInputSchema: z.ZodType<Prisma.PatientVisitUpsertWithWhereUniqueWithoutDoctorInput> = z.object({
  where: z.lazy(() => PatientVisitWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PatientVisitUpdateWithoutDoctorInputSchema),z.lazy(() => PatientVisitUncheckedUpdateWithoutDoctorInputSchema) ]),
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutDoctorInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutDoctorInputSchema) ]),
}).strict();

export const PatientVisitUpdateWithWhereUniqueWithoutDoctorInputSchema: z.ZodType<Prisma.PatientVisitUpdateWithWhereUniqueWithoutDoctorInput> = z.object({
  where: z.lazy(() => PatientVisitWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PatientVisitUpdateWithoutDoctorInputSchema),z.lazy(() => PatientVisitUncheckedUpdateWithoutDoctorInputSchema) ]),
}).strict();

export const PatientVisitUpdateManyWithWhereWithoutDoctorInputSchema: z.ZodType<Prisma.PatientVisitUpdateManyWithWhereWithoutDoctorInput> = z.object({
  where: z.lazy(() => PatientVisitScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PatientVisitUpdateManyMutationInputSchema),z.lazy(() => PatientVisitUncheckedUpdateManyWithoutDoctorInputSchema) ]),
}).strict();

export const DepartmentUpsertWithoutUserInputSchema: z.ZodType<Prisma.DepartmentUpsertWithoutUserInput> = z.object({
  update: z.union([ z.lazy(() => DepartmentUpdateWithoutUserInputSchema),z.lazy(() => DepartmentUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => DepartmentCreateWithoutUserInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => DepartmentWhereInputSchema).optional()
}).strict();

export const DepartmentUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.DepartmentUpdateToOneWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => DepartmentWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DepartmentUpdateWithoutUserInputSchema),z.lazy(() => DepartmentUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const DepartmentUpdateWithoutUserInputSchema: z.ZodType<Prisma.DepartmentUpdateWithoutUserInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutDepartmentNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUpdateOneRequiredWithoutDepartmentNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutDepartmentNestedInputSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUpdateManyWithoutDepartmentNestedInputSchema).optional()
}).strict();

export const DepartmentUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.DepartmentUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutDepartmentNestedInputSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUncheckedUpdateManyWithoutDepartmentNestedInputSchema).optional()
}).strict();

export const HospitalUpsertWithoutUserInputSchema: z.ZodType<Prisma.HospitalUpsertWithoutUserInput> = z.object({
  update: z.union([ z.lazy(() => HospitalUpdateWithoutUserInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => HospitalCreateWithoutUserInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => HospitalWhereInputSchema).optional()
}).strict();

export const HospitalUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.HospitalUpdateToOneWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => HospitalWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => HospitalUpdateWithoutUserInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const HospitalUpdateWithoutUserInputSchema: z.ZodType<Prisma.HospitalUpdateWithoutUserInput> = z.object({
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUpdateManyWithoutHospitalNestedInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUpdateManyWithoutHospitalNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Permission: z.lazy(() => PermissionUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUpdateManyWithoutHospitalNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Vendor: z.lazy(() => VendorUpdateManyWithoutHospitalNestedInputSchema).optional()
}).strict();

export const HospitalUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.HospitalUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Permission: z.lazy(() => PermissionUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Vendor: z.lazy(() => VendorUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional()
}).strict();

export const UserLoginUpsertWithoutUserInputSchema: z.ZodType<Prisma.UserLoginUpsertWithoutUserInput> = z.object({
  update: z.union([ z.lazy(() => UserLoginUpdateWithoutUserInputSchema),z.lazy(() => UserLoginUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => UserLoginCreateWithoutUserInputSchema),z.lazy(() => UserLoginUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => UserLoginWhereInputSchema).optional()
}).strict();

export const UserLoginUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.UserLoginUpdateToOneWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => UserLoginWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserLoginUpdateWithoutUserInputSchema),z.lazy(() => UserLoginUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const UserLoginUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserLoginUpdateWithoutUserInput> = z.object({
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserLoginUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserLoginUncheckedUpdateWithoutUserInput> = z.object({
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserRoleUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.UserRoleUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => UserRoleWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserRoleUpdateWithoutUserInputSchema),z.lazy(() => UserRoleUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => UserRoleCreateWithoutUserInputSchema),z.lazy(() => UserRoleUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UserRoleUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.UserRoleUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => UserRoleWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserRoleUpdateWithoutUserInputSchema),z.lazy(() => UserRoleUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const UserRoleUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.UserRoleUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => UserRoleScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserRoleUpdateManyMutationInputSchema),z.lazy(() => UserRoleUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const UserRoleScalarWhereInputSchema: z.ZodType<Prisma.UserRoleScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserRoleScalarWhereInputSchema),z.lazy(() => UserRoleScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserRoleScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserRoleScalarWhereInputSchema),z.lazy(() => UserRoleScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  roleId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateWithoutUserLoginInputSchema: z.ZodType<Prisma.UserCreateWithoutUserLoginInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  isActive: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentCreateNestedManyWithoutDoctorInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutDoctorInputSchema).optional(),
  Department: z.lazy(() => DepartmentCreateNestedOneWithoutUserInputSchema),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutUserInputSchema),
  UserRole: z.lazy(() => UserRoleCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutUserLoginInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutUserLoginInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  hospitalId: z.number().int(),
  department: z.number().int(),
  isActive: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentUncheckedCreateNestedManyWithoutDoctorInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutDoctorInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutUserLoginInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutUserLoginInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutUserLoginInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserLoginInputSchema) ]),
}).strict();

export const UserUpsertWithoutUserLoginInputSchema: z.ZodType<Prisma.UserUpsertWithoutUserLoginInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutUserLoginInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUserLoginInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutUserLoginInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserLoginInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutUserLoginInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutUserLoginInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutUserLoginInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUserLoginInputSchema) ]),
}).strict();

export const UserUpdateWithoutUserLoginInputSchema: z.ZodType<Prisma.UserUpdateWithoutUserLoginInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUpdateManyWithoutDoctorNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutDoctorNestedInputSchema).optional(),
  Department: z.lazy(() => DepartmentUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutUserLoginInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutUserLoginInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  department: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUncheckedUpdateManyWithoutDoctorNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutDoctorNestedInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const DepartmentCreateWithoutRoleInputSchema: z.ZodType<Prisma.DepartmentCreateWithoutRoleInput> = z.object({
  name: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutDepartmentInputSchema),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutDepartmentInputSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentCreateNestedManyWithoutDepartmentInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedManyWithoutDepartmentInputSchema).optional()
}).strict();

export const DepartmentUncheckedCreateWithoutRoleInputSchema: z.ZodType<Prisma.DepartmentUncheckedCreateWithoutRoleInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  hospitalId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutDepartmentInputSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUncheckedCreateNestedManyWithoutDepartmentInputSchema).optional(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutDepartmentInputSchema).optional()
}).strict();

export const DepartmentCreateOrConnectWithoutRoleInputSchema: z.ZodType<Prisma.DepartmentCreateOrConnectWithoutRoleInput> = z.object({
  where: z.lazy(() => DepartmentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DepartmentCreateWithoutRoleInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutRoleInputSchema) ]),
}).strict();

export const DepartmentCreateManyRoleInputEnvelopeSchema: z.ZodType<Prisma.DepartmentCreateManyRoleInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DepartmentCreateManyRoleInputSchema),z.lazy(() => DepartmentCreateManyRoleInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const HospitalCreateWithoutRoleInputSchema: z.ZodType<Prisma.HospitalCreateWithoutRoleInput> = z.object({
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentCreateNestedManyWithoutHospitalInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackCreateNestedManyWithoutHospitalInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutHospitalInputSchema).optional(),
  Permission: z.lazy(() => PermissionCreateNestedManyWithoutHospitalInputSchema).optional(),
  Product: z.lazy(() => ProductCreateNestedManyWithoutHospitalInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentCreateNestedManyWithoutHospitalInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedManyWithoutHospitalInputSchema).optional(),
  Vendor: z.lazy(() => VendorCreateNestedManyWithoutHospitalInputSchema).optional()
}).strict();

export const HospitalUncheckedCreateWithoutRoleInputSchema: z.ZodType<Prisma.HospitalUncheckedCreateWithoutRoleInput> = z.object({
  id: z.number().int().optional(),
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Permission: z.lazy(() => PermissionUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Vendor: z.lazy(() => VendorUncheckedCreateNestedManyWithoutHospitalInputSchema).optional()
}).strict();

export const HospitalCreateOrConnectWithoutRoleInputSchema: z.ZodType<Prisma.HospitalCreateOrConnectWithoutRoleInput> = z.object({
  where: z.lazy(() => HospitalWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => HospitalCreateWithoutRoleInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutRoleInputSchema) ]),
}).strict();

export const RolePermissionCreateWithoutRoleInputSchema: z.ZodType<Prisma.RolePermissionCreateWithoutRoleInput> = z.object({
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  permission: z.lazy(() => PermissionCreateNestedOneWithoutRolePermissionsInputSchema)
}).strict();

export const RolePermissionUncheckedCreateWithoutRoleInputSchema: z.ZodType<Prisma.RolePermissionUncheckedCreateWithoutRoleInput> = z.object({
  id: z.number().int().optional(),
  permissionId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const RolePermissionCreateOrConnectWithoutRoleInputSchema: z.ZodType<Prisma.RolePermissionCreateOrConnectWithoutRoleInput> = z.object({
  where: z.lazy(() => RolePermissionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RolePermissionCreateWithoutRoleInputSchema),z.lazy(() => RolePermissionUncheckedCreateWithoutRoleInputSchema) ]),
}).strict();

export const RolePermissionCreateManyRoleInputEnvelopeSchema: z.ZodType<Prisma.RolePermissionCreateManyRoleInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => RolePermissionCreateManyRoleInputSchema),z.lazy(() => RolePermissionCreateManyRoleInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserRoleCreateWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleCreateWithoutRoleInput> = z.object({
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutUserRoleInputSchema)
}).strict();

export const UserRoleUncheckedCreateWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleUncheckedCreateWithoutRoleInput> = z.object({
  id: z.number().int().optional(),
  userId: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const UserRoleCreateOrConnectWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleCreateOrConnectWithoutRoleInput> = z.object({
  where: z.lazy(() => UserRoleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserRoleCreateWithoutRoleInputSchema),z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputSchema) ]),
}).strict();

export const UserRoleCreateManyRoleInputEnvelopeSchema: z.ZodType<Prisma.UserRoleCreateManyRoleInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserRoleCreateManyRoleInputSchema),z.lazy(() => UserRoleCreateManyRoleInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DepartmentUpsertWithWhereUniqueWithoutRoleInputSchema: z.ZodType<Prisma.DepartmentUpsertWithWhereUniqueWithoutRoleInput> = z.object({
  where: z.lazy(() => DepartmentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DepartmentUpdateWithoutRoleInputSchema),z.lazy(() => DepartmentUncheckedUpdateWithoutRoleInputSchema) ]),
  create: z.union([ z.lazy(() => DepartmentCreateWithoutRoleInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutRoleInputSchema) ]),
}).strict();

export const DepartmentUpdateWithWhereUniqueWithoutRoleInputSchema: z.ZodType<Prisma.DepartmentUpdateWithWhereUniqueWithoutRoleInput> = z.object({
  where: z.lazy(() => DepartmentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DepartmentUpdateWithoutRoleInputSchema),z.lazy(() => DepartmentUncheckedUpdateWithoutRoleInputSchema) ]),
}).strict();

export const DepartmentUpdateManyWithWhereWithoutRoleInputSchema: z.ZodType<Prisma.DepartmentUpdateManyWithWhereWithoutRoleInput> = z.object({
  where: z.lazy(() => DepartmentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DepartmentUpdateManyMutationInputSchema),z.lazy(() => DepartmentUncheckedUpdateManyWithoutRoleInputSchema) ]),
}).strict();

export const HospitalUpsertWithoutRoleInputSchema: z.ZodType<Prisma.HospitalUpsertWithoutRoleInput> = z.object({
  update: z.union([ z.lazy(() => HospitalUpdateWithoutRoleInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutRoleInputSchema) ]),
  create: z.union([ z.lazy(() => HospitalCreateWithoutRoleInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutRoleInputSchema) ]),
  where: z.lazy(() => HospitalWhereInputSchema).optional()
}).strict();

export const HospitalUpdateToOneWithWhereWithoutRoleInputSchema: z.ZodType<Prisma.HospitalUpdateToOneWithWhereWithoutRoleInput> = z.object({
  where: z.lazy(() => HospitalWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => HospitalUpdateWithoutRoleInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutRoleInputSchema) ]),
}).strict();

export const HospitalUpdateWithoutRoleInputSchema: z.ZodType<Prisma.HospitalUpdateWithoutRoleInput> = z.object({
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUpdateManyWithoutHospitalNestedInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUpdateManyWithoutHospitalNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Permission: z.lazy(() => PermissionUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUpdateManyWithoutHospitalNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUpdateManyWithoutHospitalNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Vendor: z.lazy(() => VendorUpdateManyWithoutHospitalNestedInputSchema).optional()
}).strict();

export const HospitalUncheckedUpdateWithoutRoleInputSchema: z.ZodType<Prisma.HospitalUncheckedUpdateWithoutRoleInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Permission: z.lazy(() => PermissionUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Vendor: z.lazy(() => VendorUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional()
}).strict();

export const RolePermissionUpsertWithWhereUniqueWithoutRoleInputSchema: z.ZodType<Prisma.RolePermissionUpsertWithWhereUniqueWithoutRoleInput> = z.object({
  where: z.lazy(() => RolePermissionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => RolePermissionUpdateWithoutRoleInputSchema),z.lazy(() => RolePermissionUncheckedUpdateWithoutRoleInputSchema) ]),
  create: z.union([ z.lazy(() => RolePermissionCreateWithoutRoleInputSchema),z.lazy(() => RolePermissionUncheckedCreateWithoutRoleInputSchema) ]),
}).strict();

export const RolePermissionUpdateWithWhereUniqueWithoutRoleInputSchema: z.ZodType<Prisma.RolePermissionUpdateWithWhereUniqueWithoutRoleInput> = z.object({
  where: z.lazy(() => RolePermissionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => RolePermissionUpdateWithoutRoleInputSchema),z.lazy(() => RolePermissionUncheckedUpdateWithoutRoleInputSchema) ]),
}).strict();

export const RolePermissionUpdateManyWithWhereWithoutRoleInputSchema: z.ZodType<Prisma.RolePermissionUpdateManyWithWhereWithoutRoleInput> = z.object({
  where: z.lazy(() => RolePermissionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => RolePermissionUpdateManyMutationInputSchema),z.lazy(() => RolePermissionUncheckedUpdateManyWithoutRoleInputSchema) ]),
}).strict();

export const RolePermissionScalarWhereInputSchema: z.ZodType<Prisma.RolePermissionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RolePermissionScalarWhereInputSchema),z.lazy(() => RolePermissionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RolePermissionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RolePermissionScalarWhereInputSchema),z.lazy(() => RolePermissionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  roleId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  permissionId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  updatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserRoleUpsertWithWhereUniqueWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleUpsertWithWhereUniqueWithoutRoleInput> = z.object({
  where: z.lazy(() => UserRoleWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserRoleUpdateWithoutRoleInputSchema),z.lazy(() => UserRoleUncheckedUpdateWithoutRoleInputSchema) ]),
  create: z.union([ z.lazy(() => UserRoleCreateWithoutRoleInputSchema),z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputSchema) ]),
}).strict();

export const UserRoleUpdateWithWhereUniqueWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleUpdateWithWhereUniqueWithoutRoleInput> = z.object({
  where: z.lazy(() => UserRoleWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserRoleUpdateWithoutRoleInputSchema),z.lazy(() => UserRoleUncheckedUpdateWithoutRoleInputSchema) ]),
}).strict();

export const UserRoleUpdateManyWithWhereWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleUpdateManyWithWhereWithoutRoleInput> = z.object({
  where: z.lazy(() => UserRoleScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserRoleUpdateManyMutationInputSchema),z.lazy(() => UserRoleUncheckedUpdateManyWithoutRoleInputSchema) ]),
}).strict();

export const RoleCreateWithoutRoleUsersInputSchema: z.ZodType<Prisma.RoleCreateWithoutRoleUsersInput> = z.object({
  roleName: z.string(),
  description: z.string().optional().nullable(),
  isSuperAdmin: z.boolean().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentCreateNestedManyWithoutRoleInputSchema).optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutRoleInputSchema),
  permissions: z.lazy(() => RolePermissionCreateNestedManyWithoutRoleInputSchema).optional()
}).strict();

export const RoleUncheckedCreateWithoutRoleUsersInputSchema: z.ZodType<Prisma.RoleUncheckedCreateWithoutRoleUsersInput> = z.object({
  id: z.number().int().optional(),
  roleName: z.string(),
  description: z.string().optional().nullable(),
  hospitalId: z.number().int(),
  isSuperAdmin: z.boolean().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentUncheckedCreateNestedManyWithoutRoleInputSchema).optional(),
  permissions: z.lazy(() => RolePermissionUncheckedCreateNestedManyWithoutRoleInputSchema).optional()
}).strict();

export const RoleCreateOrConnectWithoutRoleUsersInputSchema: z.ZodType<Prisma.RoleCreateOrConnectWithoutRoleUsersInput> = z.object({
  where: z.lazy(() => RoleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RoleCreateWithoutRoleUsersInputSchema),z.lazy(() => RoleUncheckedCreateWithoutRoleUsersInputSchema) ]),
}).strict();

export const UserCreateWithoutUserRoleInputSchema: z.ZodType<Prisma.UserCreateWithoutUserRoleInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  isActive: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentCreateNestedManyWithoutDoctorInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutDoctorInputSchema).optional(),
  Department: z.lazy(() => DepartmentCreateNestedOneWithoutUserInputSchema),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutUserInputSchema),
  UserLogin: z.lazy(() => UserLoginCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutUserRoleInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutUserRoleInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  hospitalId: z.number().int(),
  department: z.number().int(),
  isActive: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentUncheckedCreateNestedManyWithoutDoctorInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutDoctorInputSchema).optional(),
  UserLogin: z.lazy(() => UserLoginUncheckedCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutUserRoleInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutUserRoleInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutUserRoleInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserRoleInputSchema) ]),
}).strict();

export const RoleUpsertWithoutRoleUsersInputSchema: z.ZodType<Prisma.RoleUpsertWithoutRoleUsersInput> = z.object({
  update: z.union([ z.lazy(() => RoleUpdateWithoutRoleUsersInputSchema),z.lazy(() => RoleUncheckedUpdateWithoutRoleUsersInputSchema) ]),
  create: z.union([ z.lazy(() => RoleCreateWithoutRoleUsersInputSchema),z.lazy(() => RoleUncheckedCreateWithoutRoleUsersInputSchema) ]),
  where: z.lazy(() => RoleWhereInputSchema).optional()
}).strict();

export const RoleUpdateToOneWithWhereWithoutRoleUsersInputSchema: z.ZodType<Prisma.RoleUpdateToOneWithWhereWithoutRoleUsersInput> = z.object({
  where: z.lazy(() => RoleWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => RoleUpdateWithoutRoleUsersInputSchema),z.lazy(() => RoleUncheckedUpdateWithoutRoleUsersInputSchema) ]),
}).strict();

export const RoleUpdateWithoutRoleUsersInputSchema: z.ZodType<Prisma.RoleUpdateWithoutRoleUsersInput> = z.object({
  roleName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isSuperAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUpdateManyWithoutRoleNestedInputSchema).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutRoleNestedInputSchema).optional(),
  permissions: z.lazy(() => RolePermissionUpdateManyWithoutRoleNestedInputSchema).optional()
}).strict();

export const RoleUncheckedUpdateWithoutRoleUsersInputSchema: z.ZodType<Prisma.RoleUncheckedUpdateWithoutRoleUsersInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  roleName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isSuperAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUncheckedUpdateManyWithoutRoleNestedInputSchema).optional(),
  permissions: z.lazy(() => RolePermissionUncheckedUpdateManyWithoutRoleNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutUserRoleInputSchema: z.ZodType<Prisma.UserUpsertWithoutUserRoleInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutUserRoleInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUserRoleInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutUserRoleInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserRoleInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutUserRoleInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutUserRoleInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutUserRoleInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUserRoleInputSchema) ]),
}).strict();

export const UserUpdateWithoutUserRoleInputSchema: z.ZodType<Prisma.UserUpdateWithoutUserRoleInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUpdateManyWithoutDoctorNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutDoctorNestedInputSchema).optional(),
  Department: z.lazy(() => DepartmentUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  UserLogin: z.lazy(() => UserLoginUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutUserRoleInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutUserRoleInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  department: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUncheckedUpdateManyWithoutDoctorNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutDoctorNestedInputSchema).optional(),
  UserLogin: z.lazy(() => UserLoginUncheckedUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const HospitalCreateWithoutPermissionInputSchema: z.ZodType<Prisma.HospitalCreateWithoutPermissionInput> = z.object({
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentCreateNestedManyWithoutHospitalInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackCreateNestedManyWithoutHospitalInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutHospitalInputSchema).optional(),
  Product: z.lazy(() => ProductCreateNestedManyWithoutHospitalInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentCreateNestedManyWithoutHospitalInputSchema).optional(),
  Role: z.lazy(() => RoleCreateNestedManyWithoutHospitalInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedManyWithoutHospitalInputSchema).optional(),
  Vendor: z.lazy(() => VendorCreateNestedManyWithoutHospitalInputSchema).optional()
}).strict();

export const HospitalUncheckedCreateWithoutPermissionInputSchema: z.ZodType<Prisma.HospitalUncheckedCreateWithoutPermissionInput> = z.object({
  id: z.number().int().optional(),
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Role: z.lazy(() => RoleUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Vendor: z.lazy(() => VendorUncheckedCreateNestedManyWithoutHospitalInputSchema).optional()
}).strict();

export const HospitalCreateOrConnectWithoutPermissionInputSchema: z.ZodType<Prisma.HospitalCreateOrConnectWithoutPermissionInput> = z.object({
  where: z.lazy(() => HospitalWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => HospitalCreateWithoutPermissionInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutPermissionInputSchema) ]),
}).strict();

export const RolePermissionCreateWithoutPermissionInputSchema: z.ZodType<Prisma.RolePermissionCreateWithoutPermissionInput> = z.object({
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  role: z.lazy(() => RoleCreateNestedOneWithoutPermissionsInputSchema)
}).strict();

export const RolePermissionUncheckedCreateWithoutPermissionInputSchema: z.ZodType<Prisma.RolePermissionUncheckedCreateWithoutPermissionInput> = z.object({
  id: z.number().int().optional(),
  roleId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const RolePermissionCreateOrConnectWithoutPermissionInputSchema: z.ZodType<Prisma.RolePermissionCreateOrConnectWithoutPermissionInput> = z.object({
  where: z.lazy(() => RolePermissionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RolePermissionCreateWithoutPermissionInputSchema),z.lazy(() => RolePermissionUncheckedCreateWithoutPermissionInputSchema) ]),
}).strict();

export const RolePermissionCreateManyPermissionInputEnvelopeSchema: z.ZodType<Prisma.RolePermissionCreateManyPermissionInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => RolePermissionCreateManyPermissionInputSchema),z.lazy(() => RolePermissionCreateManyPermissionInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const HospitalUpsertWithoutPermissionInputSchema: z.ZodType<Prisma.HospitalUpsertWithoutPermissionInput> = z.object({
  update: z.union([ z.lazy(() => HospitalUpdateWithoutPermissionInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutPermissionInputSchema) ]),
  create: z.union([ z.lazy(() => HospitalCreateWithoutPermissionInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutPermissionInputSchema) ]),
  where: z.lazy(() => HospitalWhereInputSchema).optional()
}).strict();

export const HospitalUpdateToOneWithWhereWithoutPermissionInputSchema: z.ZodType<Prisma.HospitalUpdateToOneWithWhereWithoutPermissionInput> = z.object({
  where: z.lazy(() => HospitalWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => HospitalUpdateWithoutPermissionInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutPermissionInputSchema) ]),
}).strict();

export const HospitalUpdateWithoutPermissionInputSchema: z.ZodType<Prisma.HospitalUpdateWithoutPermissionInput> = z.object({
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUpdateManyWithoutHospitalNestedInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUpdateManyWithoutHospitalNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUpdateManyWithoutHospitalNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUpdateManyWithoutHospitalNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Vendor: z.lazy(() => VendorUpdateManyWithoutHospitalNestedInputSchema).optional()
}).strict();

export const HospitalUncheckedUpdateWithoutPermissionInputSchema: z.ZodType<Prisma.HospitalUncheckedUpdateWithoutPermissionInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Vendor: z.lazy(() => VendorUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional()
}).strict();

export const RolePermissionUpsertWithWhereUniqueWithoutPermissionInputSchema: z.ZodType<Prisma.RolePermissionUpsertWithWhereUniqueWithoutPermissionInput> = z.object({
  where: z.lazy(() => RolePermissionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => RolePermissionUpdateWithoutPermissionInputSchema),z.lazy(() => RolePermissionUncheckedUpdateWithoutPermissionInputSchema) ]),
  create: z.union([ z.lazy(() => RolePermissionCreateWithoutPermissionInputSchema),z.lazy(() => RolePermissionUncheckedCreateWithoutPermissionInputSchema) ]),
}).strict();

export const RolePermissionUpdateWithWhereUniqueWithoutPermissionInputSchema: z.ZodType<Prisma.RolePermissionUpdateWithWhereUniqueWithoutPermissionInput> = z.object({
  where: z.lazy(() => RolePermissionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => RolePermissionUpdateWithoutPermissionInputSchema),z.lazy(() => RolePermissionUncheckedUpdateWithoutPermissionInputSchema) ]),
}).strict();

export const RolePermissionUpdateManyWithWhereWithoutPermissionInputSchema: z.ZodType<Prisma.RolePermissionUpdateManyWithWhereWithoutPermissionInput> = z.object({
  where: z.lazy(() => RolePermissionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => RolePermissionUpdateManyMutationInputSchema),z.lazy(() => RolePermissionUncheckedUpdateManyWithoutPermissionInputSchema) ]),
}).strict();

export const PermissionCreateWithoutRolePermissionsInputSchema: z.ZodType<Prisma.PermissionCreateWithoutRolePermissionsInput> = z.object({
  permissionName: z.string(),
  description: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutPermissionInputSchema)
}).strict();

export const PermissionUncheckedCreateWithoutRolePermissionsInputSchema: z.ZodType<Prisma.PermissionUncheckedCreateWithoutRolePermissionsInput> = z.object({
  id: z.number().int().optional(),
  permissionName: z.string(),
  description: z.string().optional().nullable(),
  hospitalId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PermissionCreateOrConnectWithoutRolePermissionsInputSchema: z.ZodType<Prisma.PermissionCreateOrConnectWithoutRolePermissionsInput> = z.object({
  where: z.lazy(() => PermissionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PermissionCreateWithoutRolePermissionsInputSchema),z.lazy(() => PermissionUncheckedCreateWithoutRolePermissionsInputSchema) ]),
}).strict();

export const RoleCreateWithoutPermissionsInputSchema: z.ZodType<Prisma.RoleCreateWithoutPermissionsInput> = z.object({
  roleName: z.string(),
  description: z.string().optional().nullable(),
  isSuperAdmin: z.boolean().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentCreateNestedManyWithoutRoleInputSchema).optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutRoleInputSchema),
  roleUsers: z.lazy(() => UserRoleCreateNestedManyWithoutRoleInputSchema).optional()
}).strict();

export const RoleUncheckedCreateWithoutPermissionsInputSchema: z.ZodType<Prisma.RoleUncheckedCreateWithoutPermissionsInput> = z.object({
  id: z.number().int().optional(),
  roleName: z.string(),
  description: z.string().optional().nullable(),
  hospitalId: z.number().int(),
  isSuperAdmin: z.boolean().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentUncheckedCreateNestedManyWithoutRoleInputSchema).optional(),
  roleUsers: z.lazy(() => UserRoleUncheckedCreateNestedManyWithoutRoleInputSchema).optional()
}).strict();

export const RoleCreateOrConnectWithoutPermissionsInputSchema: z.ZodType<Prisma.RoleCreateOrConnectWithoutPermissionsInput> = z.object({
  where: z.lazy(() => RoleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RoleCreateWithoutPermissionsInputSchema),z.lazy(() => RoleUncheckedCreateWithoutPermissionsInputSchema) ]),
}).strict();

export const PermissionUpsertWithoutRolePermissionsInputSchema: z.ZodType<Prisma.PermissionUpsertWithoutRolePermissionsInput> = z.object({
  update: z.union([ z.lazy(() => PermissionUpdateWithoutRolePermissionsInputSchema),z.lazy(() => PermissionUncheckedUpdateWithoutRolePermissionsInputSchema) ]),
  create: z.union([ z.lazy(() => PermissionCreateWithoutRolePermissionsInputSchema),z.lazy(() => PermissionUncheckedCreateWithoutRolePermissionsInputSchema) ]),
  where: z.lazy(() => PermissionWhereInputSchema).optional()
}).strict();

export const PermissionUpdateToOneWithWhereWithoutRolePermissionsInputSchema: z.ZodType<Prisma.PermissionUpdateToOneWithWhereWithoutRolePermissionsInput> = z.object({
  where: z.lazy(() => PermissionWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PermissionUpdateWithoutRolePermissionsInputSchema),z.lazy(() => PermissionUncheckedUpdateWithoutRolePermissionsInputSchema) ]),
}).strict();

export const PermissionUpdateWithoutRolePermissionsInputSchema: z.ZodType<Prisma.PermissionUpdateWithoutRolePermissionsInput> = z.object({
  permissionName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutPermissionNestedInputSchema).optional()
}).strict();

export const PermissionUncheckedUpdateWithoutRolePermissionsInputSchema: z.ZodType<Prisma.PermissionUncheckedUpdateWithoutRolePermissionsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  permissionName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RoleUpsertWithoutPermissionsInputSchema: z.ZodType<Prisma.RoleUpsertWithoutPermissionsInput> = z.object({
  update: z.union([ z.lazy(() => RoleUpdateWithoutPermissionsInputSchema),z.lazy(() => RoleUncheckedUpdateWithoutPermissionsInputSchema) ]),
  create: z.union([ z.lazy(() => RoleCreateWithoutPermissionsInputSchema),z.lazy(() => RoleUncheckedCreateWithoutPermissionsInputSchema) ]),
  where: z.lazy(() => RoleWhereInputSchema).optional()
}).strict();

export const RoleUpdateToOneWithWhereWithoutPermissionsInputSchema: z.ZodType<Prisma.RoleUpdateToOneWithWhereWithoutPermissionsInput> = z.object({
  where: z.lazy(() => RoleWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => RoleUpdateWithoutPermissionsInputSchema),z.lazy(() => RoleUncheckedUpdateWithoutPermissionsInputSchema) ]),
}).strict();

export const RoleUpdateWithoutPermissionsInputSchema: z.ZodType<Prisma.RoleUpdateWithoutPermissionsInput> = z.object({
  roleName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isSuperAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUpdateManyWithoutRoleNestedInputSchema).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutRoleNestedInputSchema).optional(),
  roleUsers: z.lazy(() => UserRoleUpdateManyWithoutRoleNestedInputSchema).optional()
}).strict();

export const RoleUncheckedUpdateWithoutPermissionsInputSchema: z.ZodType<Prisma.RoleUncheckedUpdateWithoutPermissionsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  roleName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isSuperAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUncheckedUpdateManyWithoutRoleNestedInputSchema).optional(),
  roleUsers: z.lazy(() => UserRoleUncheckedUpdateManyWithoutRoleNestedInputSchema).optional()
}).strict();

export const HospitalCreateWithoutVendorInputSchema: z.ZodType<Prisma.HospitalCreateWithoutVendorInput> = z.object({
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentCreateNestedManyWithoutHospitalInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackCreateNestedManyWithoutHospitalInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutHospitalInputSchema).optional(),
  Permission: z.lazy(() => PermissionCreateNestedManyWithoutHospitalInputSchema).optional(),
  Product: z.lazy(() => ProductCreateNestedManyWithoutHospitalInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentCreateNestedManyWithoutHospitalInputSchema).optional(),
  Role: z.lazy(() => RoleCreateNestedManyWithoutHospitalInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedManyWithoutHospitalInputSchema).optional()
}).strict();

export const HospitalUncheckedCreateWithoutVendorInputSchema: z.ZodType<Prisma.HospitalUncheckedCreateWithoutVendorInput> = z.object({
  id: z.number().int().optional(),
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Permission: z.lazy(() => PermissionUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Role: z.lazy(() => RoleUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutHospitalInputSchema).optional()
}).strict();

export const HospitalCreateOrConnectWithoutVendorInputSchema: z.ZodType<Prisma.HospitalCreateOrConnectWithoutVendorInput> = z.object({
  where: z.lazy(() => HospitalWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => HospitalCreateWithoutVendorInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutVendorInputSchema) ]),
}).strict();

export const HospitalUpsertWithoutVendorInputSchema: z.ZodType<Prisma.HospitalUpsertWithoutVendorInput> = z.object({
  update: z.union([ z.lazy(() => HospitalUpdateWithoutVendorInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutVendorInputSchema) ]),
  create: z.union([ z.lazy(() => HospitalCreateWithoutVendorInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutVendorInputSchema) ]),
  where: z.lazy(() => HospitalWhereInputSchema).optional()
}).strict();

export const HospitalUpdateToOneWithWhereWithoutVendorInputSchema: z.ZodType<Prisma.HospitalUpdateToOneWithWhereWithoutVendorInput> = z.object({
  where: z.lazy(() => HospitalWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => HospitalUpdateWithoutVendorInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutVendorInputSchema) ]),
}).strict();

export const HospitalUpdateWithoutVendorInputSchema: z.ZodType<Prisma.HospitalUpdateWithoutVendorInput> = z.object({
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUpdateManyWithoutHospitalNestedInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUpdateManyWithoutHospitalNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Permission: z.lazy(() => PermissionUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUpdateManyWithoutHospitalNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUpdateManyWithoutHospitalNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateManyWithoutHospitalNestedInputSchema).optional()
}).strict();

export const HospitalUncheckedUpdateWithoutVendorInputSchema: z.ZodType<Prisma.HospitalUncheckedUpdateWithoutVendorInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Permission: z.lazy(() => PermissionUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional()
}).strict();

export const HospitalCreateWithoutProductInputSchema: z.ZodType<Prisma.HospitalCreateWithoutProductInput> = z.object({
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentCreateNestedManyWithoutHospitalInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackCreateNestedManyWithoutHospitalInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutHospitalInputSchema).optional(),
  Permission: z.lazy(() => PermissionCreateNestedManyWithoutHospitalInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentCreateNestedManyWithoutHospitalInputSchema).optional(),
  Role: z.lazy(() => RoleCreateNestedManyWithoutHospitalInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedManyWithoutHospitalInputSchema).optional(),
  Vendor: z.lazy(() => VendorCreateNestedManyWithoutHospitalInputSchema).optional()
}).strict();

export const HospitalUncheckedCreateWithoutProductInputSchema: z.ZodType<Prisma.HospitalUncheckedCreateWithoutProductInput> = z.object({
  id: z.number().int().optional(),
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Permission: z.lazy(() => PermissionUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Role: z.lazy(() => RoleUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Vendor: z.lazy(() => VendorUncheckedCreateNestedManyWithoutHospitalInputSchema).optional()
}).strict();

export const HospitalCreateOrConnectWithoutProductInputSchema: z.ZodType<Prisma.HospitalCreateOrConnectWithoutProductInput> = z.object({
  where: z.lazy(() => HospitalWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => HospitalCreateWithoutProductInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutProductInputSchema) ]),
}).strict();

export const ProductDepartmentCreateWithoutProductInputSchema: z.ZodType<Prisma.ProductDepartmentCreateWithoutProductInput> = z.object({
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentCreateNestedOneWithoutProductDepartmentInputSchema)
}).strict();

export const ProductDepartmentUncheckedCreateWithoutProductInputSchema: z.ZodType<Prisma.ProductDepartmentUncheckedCreateWithoutProductInput> = z.object({
  id: z.number().int().optional(),
  departmentId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductDepartmentCreateOrConnectWithoutProductInputSchema: z.ZodType<Prisma.ProductDepartmentCreateOrConnectWithoutProductInput> = z.object({
  where: z.lazy(() => ProductDepartmentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductDepartmentCreateWithoutProductInputSchema),z.lazy(() => ProductDepartmentUncheckedCreateWithoutProductInputSchema) ]),
}).strict();

export const ProductDepartmentCreateManyProductInputEnvelopeSchema: z.ZodType<Prisma.ProductDepartmentCreateManyProductInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProductDepartmentCreateManyProductInputSchema),z.lazy(() => ProductDepartmentCreateManyProductInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProductIntentCreateWithoutProductInputSchema: z.ZodType<Prisma.ProductIntentCreateWithoutProductInput> = z.object({
  id: z.string().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutProductIntentInputSchema),
  Intent: z.lazy(() => IntentStatusCreateNestedOneWithoutProductIntentInputSchema),
  Track: z.lazy(() => IntentTrackCreateNestedOneWithoutProductIntentInputSchema)
}).strict();

export const ProductIntentUncheckedCreateWithoutProductInputSchema: z.ZodType<Prisma.ProductIntentUncheckedCreateWithoutProductInput> = z.object({
  id: z.string().optional(),
  intentId: z.number().int(),
  trackId: z.number().int(),
  hospitalId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductIntentCreateOrConnectWithoutProductInputSchema: z.ZodType<Prisma.ProductIntentCreateOrConnectWithoutProductInput> = z.object({
  where: z.lazy(() => ProductIntentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutProductInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutProductInputSchema) ]),
}).strict();

export const ProductIntentCreateManyProductInputEnvelopeSchema: z.ZodType<Prisma.ProductIntentCreateManyProductInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProductIntentCreateManyProductInputSchema),z.lazy(() => ProductIntentCreateManyProductInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const HospitalUpsertWithoutProductInputSchema: z.ZodType<Prisma.HospitalUpsertWithoutProductInput> = z.object({
  update: z.union([ z.lazy(() => HospitalUpdateWithoutProductInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutProductInputSchema) ]),
  create: z.union([ z.lazy(() => HospitalCreateWithoutProductInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutProductInputSchema) ]),
  where: z.lazy(() => HospitalWhereInputSchema).optional()
}).strict();

export const HospitalUpdateToOneWithWhereWithoutProductInputSchema: z.ZodType<Prisma.HospitalUpdateToOneWithWhereWithoutProductInput> = z.object({
  where: z.lazy(() => HospitalWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => HospitalUpdateWithoutProductInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutProductInputSchema) ]),
}).strict();

export const HospitalUpdateWithoutProductInputSchema: z.ZodType<Prisma.HospitalUpdateWithoutProductInput> = z.object({
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUpdateManyWithoutHospitalNestedInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUpdateManyWithoutHospitalNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Permission: z.lazy(() => PermissionUpdateManyWithoutHospitalNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUpdateManyWithoutHospitalNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Vendor: z.lazy(() => VendorUpdateManyWithoutHospitalNestedInputSchema).optional()
}).strict();

export const HospitalUncheckedUpdateWithoutProductInputSchema: z.ZodType<Prisma.HospitalUncheckedUpdateWithoutProductInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Permission: z.lazy(() => PermissionUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Vendor: z.lazy(() => VendorUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional()
}).strict();

export const ProductDepartmentUpsertWithWhereUniqueWithoutProductInputSchema: z.ZodType<Prisma.ProductDepartmentUpsertWithWhereUniqueWithoutProductInput> = z.object({
  where: z.lazy(() => ProductDepartmentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProductDepartmentUpdateWithoutProductInputSchema),z.lazy(() => ProductDepartmentUncheckedUpdateWithoutProductInputSchema) ]),
  create: z.union([ z.lazy(() => ProductDepartmentCreateWithoutProductInputSchema),z.lazy(() => ProductDepartmentUncheckedCreateWithoutProductInputSchema) ]),
}).strict();

export const ProductDepartmentUpdateWithWhereUniqueWithoutProductInputSchema: z.ZodType<Prisma.ProductDepartmentUpdateWithWhereUniqueWithoutProductInput> = z.object({
  where: z.lazy(() => ProductDepartmentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProductDepartmentUpdateWithoutProductInputSchema),z.lazy(() => ProductDepartmentUncheckedUpdateWithoutProductInputSchema) ]),
}).strict();

export const ProductDepartmentUpdateManyWithWhereWithoutProductInputSchema: z.ZodType<Prisma.ProductDepartmentUpdateManyWithWhereWithoutProductInput> = z.object({
  where: z.lazy(() => ProductDepartmentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProductDepartmentUpdateManyMutationInputSchema),z.lazy(() => ProductDepartmentUncheckedUpdateManyWithoutProductInputSchema) ]),
}).strict();

export const ProductIntentUpsertWithWhereUniqueWithoutProductInputSchema: z.ZodType<Prisma.ProductIntentUpsertWithWhereUniqueWithoutProductInput> = z.object({
  where: z.lazy(() => ProductIntentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProductIntentUpdateWithoutProductInputSchema),z.lazy(() => ProductIntentUncheckedUpdateWithoutProductInputSchema) ]),
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutProductInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutProductInputSchema) ]),
}).strict();

export const ProductIntentUpdateWithWhereUniqueWithoutProductInputSchema: z.ZodType<Prisma.ProductIntentUpdateWithWhereUniqueWithoutProductInput> = z.object({
  where: z.lazy(() => ProductIntentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProductIntentUpdateWithoutProductInputSchema),z.lazy(() => ProductIntentUncheckedUpdateWithoutProductInputSchema) ]),
}).strict();

export const ProductIntentUpdateManyWithWhereWithoutProductInputSchema: z.ZodType<Prisma.ProductIntentUpdateManyWithWhereWithoutProductInput> = z.object({
  where: z.lazy(() => ProductIntentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProductIntentUpdateManyMutationInputSchema),z.lazy(() => ProductIntentUncheckedUpdateManyWithoutProductInputSchema) ]),
}).strict();

export const DepartmentCreateWithoutProductDepartmentInputSchema: z.ZodType<Prisma.DepartmentCreateWithoutProductDepartmentInput> = z.object({
  name: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutDepartmentInputSchema),
  Role: z.lazy(() => RoleCreateNestedOneWithoutDepartmentInputSchema),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutDepartmentInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedManyWithoutDepartmentInputSchema).optional()
}).strict();

export const DepartmentUncheckedCreateWithoutProductDepartmentInputSchema: z.ZodType<Prisma.DepartmentUncheckedCreateWithoutProductDepartmentInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  hospitalId: z.number().int(),
  roleId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutDepartmentInputSchema).optional(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutDepartmentInputSchema).optional()
}).strict();

export const DepartmentCreateOrConnectWithoutProductDepartmentInputSchema: z.ZodType<Prisma.DepartmentCreateOrConnectWithoutProductDepartmentInput> = z.object({
  where: z.lazy(() => DepartmentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DepartmentCreateWithoutProductDepartmentInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutProductDepartmentInputSchema) ]),
}).strict();

export const ProductCreateWithoutProductDepartmentInputSchema: z.ZodType<Prisma.ProductCreateWithoutProductDepartmentInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  sku: z.string(),
  hsnCode: z.string(),
  genericName: z.string(),
  brandName: z.string(),
  manufacturer: z.string(),
  dosageForm: z.string(),
  strength: z.string(),
  purchaseRate: z.number(),
  saleRate: z.number(),
  mrp: z.number(),
  maxDiscount: z.number(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutProductInputSchema),
  ProductIntent: z.lazy(() => ProductIntentCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductUncheckedCreateWithoutProductDepartmentInputSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutProductDepartmentInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  sku: z.string(),
  hsnCode: z.string(),
  genericName: z.string(),
  brandName: z.string(),
  manufacturer: z.string(),
  dosageForm: z.string(),
  strength: z.string(),
  purchaseRate: z.number(),
  saleRate: z.number(),
  mrp: z.number(),
  maxDiscount: z.number(),
  hospitalId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductCreateOrConnectWithoutProductDepartmentInputSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutProductDepartmentInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductCreateWithoutProductDepartmentInputSchema),z.lazy(() => ProductUncheckedCreateWithoutProductDepartmentInputSchema) ]),
}).strict();

export const DepartmentUpsertWithoutProductDepartmentInputSchema: z.ZodType<Prisma.DepartmentUpsertWithoutProductDepartmentInput> = z.object({
  update: z.union([ z.lazy(() => DepartmentUpdateWithoutProductDepartmentInputSchema),z.lazy(() => DepartmentUncheckedUpdateWithoutProductDepartmentInputSchema) ]),
  create: z.union([ z.lazy(() => DepartmentCreateWithoutProductDepartmentInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutProductDepartmentInputSchema) ]),
  where: z.lazy(() => DepartmentWhereInputSchema).optional()
}).strict();

export const DepartmentUpdateToOneWithWhereWithoutProductDepartmentInputSchema: z.ZodType<Prisma.DepartmentUpdateToOneWithWhereWithoutProductDepartmentInput> = z.object({
  where: z.lazy(() => DepartmentWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DepartmentUpdateWithoutProductDepartmentInputSchema),z.lazy(() => DepartmentUncheckedUpdateWithoutProductDepartmentInputSchema) ]),
}).strict();

export const DepartmentUpdateWithoutProductDepartmentInputSchema: z.ZodType<Prisma.DepartmentUpdateWithoutProductDepartmentInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutDepartmentNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUpdateOneRequiredWithoutDepartmentNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutDepartmentNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateManyWithoutDepartmentNestedInputSchema).optional()
}).strict();

export const DepartmentUncheckedUpdateWithoutProductDepartmentInputSchema: z.ZodType<Prisma.DepartmentUncheckedUpdateWithoutProductDepartmentInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutDepartmentNestedInputSchema).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutDepartmentNestedInputSchema).optional()
}).strict();

export const ProductUpsertWithoutProductDepartmentInputSchema: z.ZodType<Prisma.ProductUpsertWithoutProductDepartmentInput> = z.object({
  update: z.union([ z.lazy(() => ProductUpdateWithoutProductDepartmentInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutProductDepartmentInputSchema) ]),
  create: z.union([ z.lazy(() => ProductCreateWithoutProductDepartmentInputSchema),z.lazy(() => ProductUncheckedCreateWithoutProductDepartmentInputSchema) ]),
  where: z.lazy(() => ProductWhereInputSchema).optional()
}).strict();

export const ProductUpdateToOneWithWhereWithoutProductDepartmentInputSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutProductDepartmentInput> = z.object({
  where: z.lazy(() => ProductWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProductUpdateWithoutProductDepartmentInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutProductDepartmentInputSchema) ]),
}).strict();

export const ProductUpdateWithoutProductDepartmentInputSchema: z.ZodType<Prisma.ProductUpdateWithoutProductDepartmentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hsnCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  genericName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brandName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  manufacturer: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dosageForm: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  strength: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  purchaseRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  saleRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  mrp: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  maxDiscount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutProductNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const ProductUncheckedUpdateWithoutProductDepartmentInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateWithoutProductDepartmentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hsnCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  genericName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brandName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  manufacturer: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dosageForm: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  strength: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  purchaseRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  saleRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  mrp: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  maxDiscount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const HospitalCreateWithoutIntentTrackInputSchema: z.ZodType<Prisma.HospitalCreateWithoutIntentTrackInput> = z.object({
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentCreateNestedManyWithoutHospitalInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutHospitalInputSchema).optional(),
  Permission: z.lazy(() => PermissionCreateNestedManyWithoutHospitalInputSchema).optional(),
  Product: z.lazy(() => ProductCreateNestedManyWithoutHospitalInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentCreateNestedManyWithoutHospitalInputSchema).optional(),
  Role: z.lazy(() => RoleCreateNestedManyWithoutHospitalInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedManyWithoutHospitalInputSchema).optional(),
  Vendor: z.lazy(() => VendorCreateNestedManyWithoutHospitalInputSchema).optional()
}).strict();

export const HospitalUncheckedCreateWithoutIntentTrackInputSchema: z.ZodType<Prisma.HospitalUncheckedCreateWithoutIntentTrackInput> = z.object({
  id: z.number().int().optional(),
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Permission: z.lazy(() => PermissionUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Role: z.lazy(() => RoleUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Vendor: z.lazy(() => VendorUncheckedCreateNestedManyWithoutHospitalInputSchema).optional()
}).strict();

export const HospitalCreateOrConnectWithoutIntentTrackInputSchema: z.ZodType<Prisma.HospitalCreateOrConnectWithoutIntentTrackInput> = z.object({
  where: z.lazy(() => HospitalWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => HospitalCreateWithoutIntentTrackInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutIntentTrackInputSchema) ]),
}).strict();

export const IntentStatusCreateWithoutTracksInputSchema: z.ZodType<Prisma.IntentStatusCreateWithoutTracksInput> = z.object({
  name: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ProductIntent: z.lazy(() => ProductIntentCreateNestedManyWithoutIntentInputSchema).optional()
}).strict();

export const IntentStatusUncheckedCreateWithoutTracksInputSchema: z.ZodType<Prisma.IntentStatusUncheckedCreateWithoutTracksInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedCreateNestedManyWithoutIntentInputSchema).optional()
}).strict();

export const IntentStatusCreateOrConnectWithoutTracksInputSchema: z.ZodType<Prisma.IntentStatusCreateOrConnectWithoutTracksInput> = z.object({
  where: z.lazy(() => IntentStatusWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => IntentStatusCreateWithoutTracksInputSchema),z.lazy(() => IntentStatusUncheckedCreateWithoutTracksInputSchema) ]),
}).strict();

export const ProductIntentCreateWithoutTrackInputSchema: z.ZodType<Prisma.ProductIntentCreateWithoutTrackInput> = z.object({
  id: z.string().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutProductIntentInputSchema),
  Intent: z.lazy(() => IntentStatusCreateNestedOneWithoutProductIntentInputSchema),
  Product: z.lazy(() => ProductCreateNestedOneWithoutProductIntentInputSchema)
}).strict();

export const ProductIntentUncheckedCreateWithoutTrackInputSchema: z.ZodType<Prisma.ProductIntentUncheckedCreateWithoutTrackInput> = z.object({
  id: z.string().optional(),
  productId: z.string(),
  intentId: z.number().int(),
  hospitalId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductIntentCreateOrConnectWithoutTrackInputSchema: z.ZodType<Prisma.ProductIntentCreateOrConnectWithoutTrackInput> = z.object({
  where: z.lazy(() => ProductIntentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutTrackInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutTrackInputSchema) ]),
}).strict();

export const ProductIntentCreateManyTrackInputEnvelopeSchema: z.ZodType<Prisma.ProductIntentCreateManyTrackInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProductIntentCreateManyTrackInputSchema),z.lazy(() => ProductIntentCreateManyTrackInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const HospitalUpsertWithoutIntentTrackInputSchema: z.ZodType<Prisma.HospitalUpsertWithoutIntentTrackInput> = z.object({
  update: z.union([ z.lazy(() => HospitalUpdateWithoutIntentTrackInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutIntentTrackInputSchema) ]),
  create: z.union([ z.lazy(() => HospitalCreateWithoutIntentTrackInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutIntentTrackInputSchema) ]),
  where: z.lazy(() => HospitalWhereInputSchema).optional()
}).strict();

export const HospitalUpdateToOneWithWhereWithoutIntentTrackInputSchema: z.ZodType<Prisma.HospitalUpdateToOneWithWhereWithoutIntentTrackInput> = z.object({
  where: z.lazy(() => HospitalWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => HospitalUpdateWithoutIntentTrackInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutIntentTrackInputSchema) ]),
}).strict();

export const HospitalUpdateWithoutIntentTrackInputSchema: z.ZodType<Prisma.HospitalUpdateWithoutIntentTrackInput> = z.object({
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUpdateManyWithoutHospitalNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Permission: z.lazy(() => PermissionUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUpdateManyWithoutHospitalNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUpdateManyWithoutHospitalNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Vendor: z.lazy(() => VendorUpdateManyWithoutHospitalNestedInputSchema).optional()
}).strict();

export const HospitalUncheckedUpdateWithoutIntentTrackInputSchema: z.ZodType<Prisma.HospitalUncheckedUpdateWithoutIntentTrackInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Permission: z.lazy(() => PermissionUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Vendor: z.lazy(() => VendorUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional()
}).strict();

export const IntentStatusUpsertWithoutTracksInputSchema: z.ZodType<Prisma.IntentStatusUpsertWithoutTracksInput> = z.object({
  update: z.union([ z.lazy(() => IntentStatusUpdateWithoutTracksInputSchema),z.lazy(() => IntentStatusUncheckedUpdateWithoutTracksInputSchema) ]),
  create: z.union([ z.lazy(() => IntentStatusCreateWithoutTracksInputSchema),z.lazy(() => IntentStatusUncheckedCreateWithoutTracksInputSchema) ]),
  where: z.lazy(() => IntentStatusWhereInputSchema).optional()
}).strict();

export const IntentStatusUpdateToOneWithWhereWithoutTracksInputSchema: z.ZodType<Prisma.IntentStatusUpdateToOneWithWhereWithoutTracksInput> = z.object({
  where: z.lazy(() => IntentStatusWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => IntentStatusUpdateWithoutTracksInputSchema),z.lazy(() => IntentStatusUncheckedUpdateWithoutTracksInputSchema) ]),
}).strict();

export const IntentStatusUpdateWithoutTracksInputSchema: z.ZodType<Prisma.IntentStatusUpdateWithoutTracksInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ProductIntent: z.lazy(() => ProductIntentUpdateManyWithoutIntentNestedInputSchema).optional()
}).strict();

export const IntentStatusUncheckedUpdateWithoutTracksInputSchema: z.ZodType<Prisma.IntentStatusUncheckedUpdateWithoutTracksInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedUpdateManyWithoutIntentNestedInputSchema).optional()
}).strict();

export const ProductIntentUpsertWithWhereUniqueWithoutTrackInputSchema: z.ZodType<Prisma.ProductIntentUpsertWithWhereUniqueWithoutTrackInput> = z.object({
  where: z.lazy(() => ProductIntentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProductIntentUpdateWithoutTrackInputSchema),z.lazy(() => ProductIntentUncheckedUpdateWithoutTrackInputSchema) ]),
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutTrackInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutTrackInputSchema) ]),
}).strict();

export const ProductIntentUpdateWithWhereUniqueWithoutTrackInputSchema: z.ZodType<Prisma.ProductIntentUpdateWithWhereUniqueWithoutTrackInput> = z.object({
  where: z.lazy(() => ProductIntentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProductIntentUpdateWithoutTrackInputSchema),z.lazy(() => ProductIntentUncheckedUpdateWithoutTrackInputSchema) ]),
}).strict();

export const ProductIntentUpdateManyWithWhereWithoutTrackInputSchema: z.ZodType<Prisma.ProductIntentUpdateManyWithWhereWithoutTrackInput> = z.object({
  where: z.lazy(() => ProductIntentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProductIntentUpdateManyMutationInputSchema),z.lazy(() => ProductIntentUncheckedUpdateManyWithoutTrackInputSchema) ]),
}).strict();

export const IntentTrackCreateWithoutIntentStatusInputSchema: z.ZodType<Prisma.IntentTrackCreateWithoutIntentStatusInput> = z.object({
  color: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutIntentTrackInputSchema),
  ProductIntent: z.lazy(() => ProductIntentCreateNestedManyWithoutTrackInputSchema).optional()
}).strict();

export const IntentTrackUncheckedCreateWithoutIntentStatusInputSchema: z.ZodType<Prisma.IntentTrackUncheckedCreateWithoutIntentStatusInput> = z.object({
  id: z.number().int().optional(),
  hospitalId: z.number().int(),
  color: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedCreateNestedManyWithoutTrackInputSchema).optional()
}).strict();

export const IntentTrackCreateOrConnectWithoutIntentStatusInputSchema: z.ZodType<Prisma.IntentTrackCreateOrConnectWithoutIntentStatusInput> = z.object({
  where: z.lazy(() => IntentTrackWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => IntentTrackCreateWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackUncheckedCreateWithoutIntentStatusInputSchema) ]),
}).strict();

export const IntentTrackCreateManyIntentStatusInputEnvelopeSchema: z.ZodType<Prisma.IntentTrackCreateManyIntentStatusInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => IntentTrackCreateManyIntentStatusInputSchema),z.lazy(() => IntentTrackCreateManyIntentStatusInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProductIntentCreateWithoutIntentInputSchema: z.ZodType<Prisma.ProductIntentCreateWithoutIntentInput> = z.object({
  id: z.string().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutProductIntentInputSchema),
  Product: z.lazy(() => ProductCreateNestedOneWithoutProductIntentInputSchema),
  Track: z.lazy(() => IntentTrackCreateNestedOneWithoutProductIntentInputSchema)
}).strict();

export const ProductIntentUncheckedCreateWithoutIntentInputSchema: z.ZodType<Prisma.ProductIntentUncheckedCreateWithoutIntentInput> = z.object({
  id: z.string().optional(),
  productId: z.string(),
  trackId: z.number().int(),
  hospitalId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductIntentCreateOrConnectWithoutIntentInputSchema: z.ZodType<Prisma.ProductIntentCreateOrConnectWithoutIntentInput> = z.object({
  where: z.lazy(() => ProductIntentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutIntentInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutIntentInputSchema) ]),
}).strict();

export const ProductIntentCreateManyIntentInputEnvelopeSchema: z.ZodType<Prisma.ProductIntentCreateManyIntentInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProductIntentCreateManyIntentInputSchema),z.lazy(() => ProductIntentCreateManyIntentInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const IntentTrackUpsertWithWhereUniqueWithoutIntentStatusInputSchema: z.ZodType<Prisma.IntentTrackUpsertWithWhereUniqueWithoutIntentStatusInput> = z.object({
  where: z.lazy(() => IntentTrackWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => IntentTrackUpdateWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackUncheckedUpdateWithoutIntentStatusInputSchema) ]),
  create: z.union([ z.lazy(() => IntentTrackCreateWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackUncheckedCreateWithoutIntentStatusInputSchema) ]),
}).strict();

export const IntentTrackUpdateWithWhereUniqueWithoutIntentStatusInputSchema: z.ZodType<Prisma.IntentTrackUpdateWithWhereUniqueWithoutIntentStatusInput> = z.object({
  where: z.lazy(() => IntentTrackWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => IntentTrackUpdateWithoutIntentStatusInputSchema),z.lazy(() => IntentTrackUncheckedUpdateWithoutIntentStatusInputSchema) ]),
}).strict();

export const IntentTrackUpdateManyWithWhereWithoutIntentStatusInputSchema: z.ZodType<Prisma.IntentTrackUpdateManyWithWhereWithoutIntentStatusInput> = z.object({
  where: z.lazy(() => IntentTrackScalarWhereInputSchema),
  data: z.union([ z.lazy(() => IntentTrackUpdateManyMutationInputSchema),z.lazy(() => IntentTrackUncheckedUpdateManyWithoutIntentStatusInputSchema) ]),
}).strict();

export const ProductIntentUpsertWithWhereUniqueWithoutIntentInputSchema: z.ZodType<Prisma.ProductIntentUpsertWithWhereUniqueWithoutIntentInput> = z.object({
  where: z.lazy(() => ProductIntentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProductIntentUpdateWithoutIntentInputSchema),z.lazy(() => ProductIntentUncheckedUpdateWithoutIntentInputSchema) ]),
  create: z.union([ z.lazy(() => ProductIntentCreateWithoutIntentInputSchema),z.lazy(() => ProductIntentUncheckedCreateWithoutIntentInputSchema) ]),
}).strict();

export const ProductIntentUpdateWithWhereUniqueWithoutIntentInputSchema: z.ZodType<Prisma.ProductIntentUpdateWithWhereUniqueWithoutIntentInput> = z.object({
  where: z.lazy(() => ProductIntentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProductIntentUpdateWithoutIntentInputSchema),z.lazy(() => ProductIntentUncheckedUpdateWithoutIntentInputSchema) ]),
}).strict();

export const ProductIntentUpdateManyWithWhereWithoutIntentInputSchema: z.ZodType<Prisma.ProductIntentUpdateManyWithWhereWithoutIntentInput> = z.object({
  where: z.lazy(() => ProductIntentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProductIntentUpdateManyMutationInputSchema),z.lazy(() => ProductIntentUncheckedUpdateManyWithoutIntentInputSchema) ]),
}).strict();

export const HospitalCreateWithoutProductIntentInputSchema: z.ZodType<Prisma.HospitalCreateWithoutProductIntentInput> = z.object({
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentCreateNestedManyWithoutHospitalInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackCreateNestedManyWithoutHospitalInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutHospitalInputSchema).optional(),
  Permission: z.lazy(() => PermissionCreateNestedManyWithoutHospitalInputSchema).optional(),
  Product: z.lazy(() => ProductCreateNestedManyWithoutHospitalInputSchema).optional(),
  Role: z.lazy(() => RoleCreateNestedManyWithoutHospitalInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedManyWithoutHospitalInputSchema).optional(),
  Vendor: z.lazy(() => VendorCreateNestedManyWithoutHospitalInputSchema).optional()
}).strict();

export const HospitalUncheckedCreateWithoutProductIntentInputSchema: z.ZodType<Prisma.HospitalUncheckedCreateWithoutProductIntentInput> = z.object({
  id: z.number().int().optional(),
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Permission: z.lazy(() => PermissionUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Role: z.lazy(() => RoleUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Vendor: z.lazy(() => VendorUncheckedCreateNestedManyWithoutHospitalInputSchema).optional()
}).strict();

export const HospitalCreateOrConnectWithoutProductIntentInputSchema: z.ZodType<Prisma.HospitalCreateOrConnectWithoutProductIntentInput> = z.object({
  where: z.lazy(() => HospitalWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => HospitalCreateWithoutProductIntentInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutProductIntentInputSchema) ]),
}).strict();

export const IntentStatusCreateWithoutProductIntentInputSchema: z.ZodType<Prisma.IntentStatusCreateWithoutProductIntentInput> = z.object({
  name: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tracks: z.lazy(() => IntentTrackCreateNestedManyWithoutIntentStatusInputSchema).optional()
}).strict();

export const IntentStatusUncheckedCreateWithoutProductIntentInputSchema: z.ZodType<Prisma.IntentStatusUncheckedCreateWithoutProductIntentInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tracks: z.lazy(() => IntentTrackUncheckedCreateNestedManyWithoutIntentStatusInputSchema).optional()
}).strict();

export const IntentStatusCreateOrConnectWithoutProductIntentInputSchema: z.ZodType<Prisma.IntentStatusCreateOrConnectWithoutProductIntentInput> = z.object({
  where: z.lazy(() => IntentStatusWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => IntentStatusCreateWithoutProductIntentInputSchema),z.lazy(() => IntentStatusUncheckedCreateWithoutProductIntentInputSchema) ]),
}).strict();

export const ProductCreateWithoutProductIntentInputSchema: z.ZodType<Prisma.ProductCreateWithoutProductIntentInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  sku: z.string(),
  hsnCode: z.string(),
  genericName: z.string(),
  brandName: z.string(),
  manufacturer: z.string(),
  dosageForm: z.string(),
  strength: z.string(),
  purchaseRate: z.number(),
  saleRate: z.number(),
  mrp: z.number(),
  maxDiscount: z.number(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutProductInputSchema),
  ProductDepartment: z.lazy(() => ProductDepartmentCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductUncheckedCreateWithoutProductIntentInputSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutProductIntentInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  sku: z.string(),
  hsnCode: z.string(),
  genericName: z.string(),
  brandName: z.string(),
  manufacturer: z.string(),
  dosageForm: z.string(),
  strength: z.string(),
  purchaseRate: z.number(),
  saleRate: z.number(),
  mrp: z.number(),
  maxDiscount: z.number(),
  hospitalId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUncheckedCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductCreateOrConnectWithoutProductIntentInputSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutProductIntentInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductCreateWithoutProductIntentInputSchema),z.lazy(() => ProductUncheckedCreateWithoutProductIntentInputSchema) ]),
}).strict();

export const IntentTrackCreateWithoutProductIntentInputSchema: z.ZodType<Prisma.IntentTrackCreateWithoutProductIntentInput> = z.object({
  color: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutIntentTrackInputSchema),
  IntentStatus: z.lazy(() => IntentStatusCreateNestedOneWithoutTracksInputSchema)
}).strict();

export const IntentTrackUncheckedCreateWithoutProductIntentInputSchema: z.ZodType<Prisma.IntentTrackUncheckedCreateWithoutProductIntentInput> = z.object({
  id: z.number().int().optional(),
  hospitalId: z.number().int(),
  statusId: z.number().int(),
  color: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const IntentTrackCreateOrConnectWithoutProductIntentInputSchema: z.ZodType<Prisma.IntentTrackCreateOrConnectWithoutProductIntentInput> = z.object({
  where: z.lazy(() => IntentTrackWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => IntentTrackCreateWithoutProductIntentInputSchema),z.lazy(() => IntentTrackUncheckedCreateWithoutProductIntentInputSchema) ]),
}).strict();

export const HospitalUpsertWithoutProductIntentInputSchema: z.ZodType<Prisma.HospitalUpsertWithoutProductIntentInput> = z.object({
  update: z.union([ z.lazy(() => HospitalUpdateWithoutProductIntentInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutProductIntentInputSchema) ]),
  create: z.union([ z.lazy(() => HospitalCreateWithoutProductIntentInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutProductIntentInputSchema) ]),
  where: z.lazy(() => HospitalWhereInputSchema).optional()
}).strict();

export const HospitalUpdateToOneWithWhereWithoutProductIntentInputSchema: z.ZodType<Prisma.HospitalUpdateToOneWithWhereWithoutProductIntentInput> = z.object({
  where: z.lazy(() => HospitalWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => HospitalUpdateWithoutProductIntentInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutProductIntentInputSchema) ]),
}).strict();

export const HospitalUpdateWithoutProductIntentInputSchema: z.ZodType<Prisma.HospitalUpdateWithoutProductIntentInput> = z.object({
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUpdateManyWithoutHospitalNestedInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUpdateManyWithoutHospitalNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Permission: z.lazy(() => PermissionUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUpdateManyWithoutHospitalNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Vendor: z.lazy(() => VendorUpdateManyWithoutHospitalNestedInputSchema).optional()
}).strict();

export const HospitalUncheckedUpdateWithoutProductIntentInputSchema: z.ZodType<Prisma.HospitalUncheckedUpdateWithoutProductIntentInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Permission: z.lazy(() => PermissionUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Vendor: z.lazy(() => VendorUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional()
}).strict();

export const IntentStatusUpsertWithoutProductIntentInputSchema: z.ZodType<Prisma.IntentStatusUpsertWithoutProductIntentInput> = z.object({
  update: z.union([ z.lazy(() => IntentStatusUpdateWithoutProductIntentInputSchema),z.lazy(() => IntentStatusUncheckedUpdateWithoutProductIntentInputSchema) ]),
  create: z.union([ z.lazy(() => IntentStatusCreateWithoutProductIntentInputSchema),z.lazy(() => IntentStatusUncheckedCreateWithoutProductIntentInputSchema) ]),
  where: z.lazy(() => IntentStatusWhereInputSchema).optional()
}).strict();

export const IntentStatusUpdateToOneWithWhereWithoutProductIntentInputSchema: z.ZodType<Prisma.IntentStatusUpdateToOneWithWhereWithoutProductIntentInput> = z.object({
  where: z.lazy(() => IntentStatusWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => IntentStatusUpdateWithoutProductIntentInputSchema),z.lazy(() => IntentStatusUncheckedUpdateWithoutProductIntentInputSchema) ]),
}).strict();

export const IntentStatusUpdateWithoutProductIntentInputSchema: z.ZodType<Prisma.IntentStatusUpdateWithoutProductIntentInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tracks: z.lazy(() => IntentTrackUpdateManyWithoutIntentStatusNestedInputSchema).optional()
}).strict();

export const IntentStatusUncheckedUpdateWithoutProductIntentInputSchema: z.ZodType<Prisma.IntentStatusUncheckedUpdateWithoutProductIntentInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tracks: z.lazy(() => IntentTrackUncheckedUpdateManyWithoutIntentStatusNestedInputSchema).optional()
}).strict();

export const ProductUpsertWithoutProductIntentInputSchema: z.ZodType<Prisma.ProductUpsertWithoutProductIntentInput> = z.object({
  update: z.union([ z.lazy(() => ProductUpdateWithoutProductIntentInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutProductIntentInputSchema) ]),
  create: z.union([ z.lazy(() => ProductCreateWithoutProductIntentInputSchema),z.lazy(() => ProductUncheckedCreateWithoutProductIntentInputSchema) ]),
  where: z.lazy(() => ProductWhereInputSchema).optional()
}).strict();

export const ProductUpdateToOneWithWhereWithoutProductIntentInputSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutProductIntentInput> = z.object({
  where: z.lazy(() => ProductWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProductUpdateWithoutProductIntentInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutProductIntentInputSchema) ]),
}).strict();

export const ProductUpdateWithoutProductIntentInputSchema: z.ZodType<Prisma.ProductUpdateWithoutProductIntentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hsnCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  genericName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brandName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  manufacturer: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dosageForm: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  strength: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  purchaseRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  saleRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  mrp: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  maxDiscount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutProductNestedInputSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const ProductUncheckedUpdateWithoutProductIntentInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateWithoutProductIntentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hsnCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  genericName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brandName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  manufacturer: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dosageForm: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  strength: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  purchaseRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  saleRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  mrp: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  maxDiscount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUncheckedUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const IntentTrackUpsertWithoutProductIntentInputSchema: z.ZodType<Prisma.IntentTrackUpsertWithoutProductIntentInput> = z.object({
  update: z.union([ z.lazy(() => IntentTrackUpdateWithoutProductIntentInputSchema),z.lazy(() => IntentTrackUncheckedUpdateWithoutProductIntentInputSchema) ]),
  create: z.union([ z.lazy(() => IntentTrackCreateWithoutProductIntentInputSchema),z.lazy(() => IntentTrackUncheckedCreateWithoutProductIntentInputSchema) ]),
  where: z.lazy(() => IntentTrackWhereInputSchema).optional()
}).strict();

export const IntentTrackUpdateToOneWithWhereWithoutProductIntentInputSchema: z.ZodType<Prisma.IntentTrackUpdateToOneWithWhereWithoutProductIntentInput> = z.object({
  where: z.lazy(() => IntentTrackWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => IntentTrackUpdateWithoutProductIntentInputSchema),z.lazy(() => IntentTrackUncheckedUpdateWithoutProductIntentInputSchema) ]),
}).strict();

export const IntentTrackUpdateWithoutProductIntentInputSchema: z.ZodType<Prisma.IntentTrackUpdateWithoutProductIntentInput> = z.object({
  color: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutIntentTrackNestedInputSchema).optional(),
  IntentStatus: z.lazy(() => IntentStatusUpdateOneRequiredWithoutTracksNestedInputSchema).optional()
}).strict();

export const IntentTrackUncheckedUpdateWithoutProductIntentInputSchema: z.ZodType<Prisma.IntentTrackUncheckedUpdateWithoutProductIntentInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  statusId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  color: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AssessmentCreateWithoutPatientInputSchema: z.ZodType<Prisma.AssessmentCreateWithoutPatientInput> = z.object({
  id: z.string().optional(),
  complaint: z.string(),
  currentMedication: z.string(),
  pastMedicalHistory: z.string(),
  examination: z.string(),
  investigation: z.string(),
  procedureDone: z.string(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  treatmentGiven: z.string(),
  followUp: z.coerce.date(),
  followupInstruction: z.string(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Doctor: z.lazy(() => UserCreateNestedOneWithoutAssessmentInputSchema),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedOneWithoutAssessmentInputSchema)
}).strict();

export const AssessmentUncheckedCreateWithoutPatientInputSchema: z.ZodType<Prisma.AssessmentUncheckedCreateWithoutPatientInput> = z.object({
  id: z.string().optional(),
  doctorId: z.string(),
  patientVisitId: z.string(),
  complaint: z.string(),
  currentMedication: z.string(),
  pastMedicalHistory: z.string(),
  examination: z.string(),
  investigation: z.string(),
  procedureDone: z.string(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  treatmentGiven: z.string(),
  followUp: z.coerce.date(),
  followupInstruction: z.string(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AssessmentCreateOrConnectWithoutPatientInputSchema: z.ZodType<Prisma.AssessmentCreateOrConnectWithoutPatientInput> = z.object({
  where: z.lazy(() => AssessmentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AssessmentCreateWithoutPatientInputSchema),z.lazy(() => AssessmentUncheckedCreateWithoutPatientInputSchema) ]),
}).strict();

export const AssessmentCreateManyPatientInputEnvelopeSchema: z.ZodType<Prisma.AssessmentCreateManyPatientInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AssessmentCreateManyPatientInputSchema),z.lazy(() => AssessmentCreateManyPatientInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PatientVisitCreateWithoutPatientInputSchema: z.ZodType<Prisma.PatientVisitCreateWithoutPatientInput> = z.object({
  id: z.string().optional(),
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentCreateNestedOneWithoutPatientVisitInputSchema).optional(),
  Department: z.lazy(() => DepartmentCreateNestedOneWithoutPatientVisitInputSchema),
  Doctor: z.lazy(() => UserCreateNestedOneWithoutPatientVisitInputSchema),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutPatientVisitInputSchema)
}).strict();

export const PatientVisitUncheckedCreateWithoutPatientInputSchema: z.ZodType<Prisma.PatientVisitUncheckedCreateWithoutPatientInput> = z.object({
  id: z.string().optional(),
  hospitalId: z.number().int(),
  departmentId: z.number().int(),
  doctorId: z.string(),
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentUncheckedCreateNestedOneWithoutPatientVisitInputSchema).optional()
}).strict();

export const PatientVisitCreateOrConnectWithoutPatientInputSchema: z.ZodType<Prisma.PatientVisitCreateOrConnectWithoutPatientInput> = z.object({
  where: z.lazy(() => PatientVisitWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutPatientInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutPatientInputSchema) ]),
}).strict();

export const PatientVisitCreateManyPatientInputEnvelopeSchema: z.ZodType<Prisma.PatientVisitCreateManyPatientInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PatientVisitCreateManyPatientInputSchema),z.lazy(() => PatientVisitCreateManyPatientInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AssessmentUpsertWithWhereUniqueWithoutPatientInputSchema: z.ZodType<Prisma.AssessmentUpsertWithWhereUniqueWithoutPatientInput> = z.object({
  where: z.lazy(() => AssessmentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AssessmentUpdateWithoutPatientInputSchema),z.lazy(() => AssessmentUncheckedUpdateWithoutPatientInputSchema) ]),
  create: z.union([ z.lazy(() => AssessmentCreateWithoutPatientInputSchema),z.lazy(() => AssessmentUncheckedCreateWithoutPatientInputSchema) ]),
}).strict();

export const AssessmentUpdateWithWhereUniqueWithoutPatientInputSchema: z.ZodType<Prisma.AssessmentUpdateWithWhereUniqueWithoutPatientInput> = z.object({
  where: z.lazy(() => AssessmentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AssessmentUpdateWithoutPatientInputSchema),z.lazy(() => AssessmentUncheckedUpdateWithoutPatientInputSchema) ]),
}).strict();

export const AssessmentUpdateManyWithWhereWithoutPatientInputSchema: z.ZodType<Prisma.AssessmentUpdateManyWithWhereWithoutPatientInput> = z.object({
  where: z.lazy(() => AssessmentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AssessmentUpdateManyMutationInputSchema),z.lazy(() => AssessmentUncheckedUpdateManyWithoutPatientInputSchema) ]),
}).strict();

export const PatientVisitUpsertWithWhereUniqueWithoutPatientInputSchema: z.ZodType<Prisma.PatientVisitUpsertWithWhereUniqueWithoutPatientInput> = z.object({
  where: z.lazy(() => PatientVisitWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PatientVisitUpdateWithoutPatientInputSchema),z.lazy(() => PatientVisitUncheckedUpdateWithoutPatientInputSchema) ]),
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutPatientInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutPatientInputSchema) ]),
}).strict();

export const PatientVisitUpdateWithWhereUniqueWithoutPatientInputSchema: z.ZodType<Prisma.PatientVisitUpdateWithWhereUniqueWithoutPatientInput> = z.object({
  where: z.lazy(() => PatientVisitWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PatientVisitUpdateWithoutPatientInputSchema),z.lazy(() => PatientVisitUncheckedUpdateWithoutPatientInputSchema) ]),
}).strict();

export const PatientVisitUpdateManyWithWhereWithoutPatientInputSchema: z.ZodType<Prisma.PatientVisitUpdateManyWithWhereWithoutPatientInput> = z.object({
  where: z.lazy(() => PatientVisitScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PatientVisitUpdateManyMutationInputSchema),z.lazy(() => PatientVisitUncheckedUpdateManyWithoutPatientInputSchema) ]),
}).strict();

export const AssessmentCreateWithoutPatientVisitInputSchema: z.ZodType<Prisma.AssessmentCreateWithoutPatientVisitInput> = z.object({
  id: z.string().optional(),
  complaint: z.string(),
  currentMedication: z.string(),
  pastMedicalHistory: z.string(),
  examination: z.string(),
  investigation: z.string(),
  procedureDone: z.string(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  treatmentGiven: z.string(),
  followUp: z.coerce.date(),
  followupInstruction: z.string(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Doctor: z.lazy(() => UserCreateNestedOneWithoutAssessmentInputSchema),
  Patient: z.lazy(() => PatientCreateNestedOneWithoutAssessmentInputSchema)
}).strict();

export const AssessmentUncheckedCreateWithoutPatientVisitInputSchema: z.ZodType<Prisma.AssessmentUncheckedCreateWithoutPatientVisitInput> = z.object({
  id: z.string().optional(),
  uhid: z.string(),
  doctorId: z.string(),
  complaint: z.string(),
  currentMedication: z.string(),
  pastMedicalHistory: z.string(),
  examination: z.string(),
  investigation: z.string(),
  procedureDone: z.string(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  treatmentGiven: z.string(),
  followUp: z.coerce.date(),
  followupInstruction: z.string(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AssessmentCreateOrConnectWithoutPatientVisitInputSchema: z.ZodType<Prisma.AssessmentCreateOrConnectWithoutPatientVisitInput> = z.object({
  where: z.lazy(() => AssessmentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AssessmentCreateWithoutPatientVisitInputSchema),z.lazy(() => AssessmentUncheckedCreateWithoutPatientVisitInputSchema) ]),
}).strict();

export const DepartmentCreateWithoutPatientVisitInputSchema: z.ZodType<Prisma.DepartmentCreateWithoutPatientVisitInput> = z.object({
  name: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutDepartmentInputSchema),
  Role: z.lazy(() => RoleCreateNestedOneWithoutDepartmentInputSchema),
  ProductDepartment: z.lazy(() => ProductDepartmentCreateNestedManyWithoutDepartmentInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedManyWithoutDepartmentInputSchema).optional()
}).strict();

export const DepartmentUncheckedCreateWithoutPatientVisitInputSchema: z.ZodType<Prisma.DepartmentUncheckedCreateWithoutPatientVisitInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  hospitalId: z.number().int(),
  roleId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUncheckedCreateNestedManyWithoutDepartmentInputSchema).optional(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutDepartmentInputSchema).optional()
}).strict();

export const DepartmentCreateOrConnectWithoutPatientVisitInputSchema: z.ZodType<Prisma.DepartmentCreateOrConnectWithoutPatientVisitInput> = z.object({
  where: z.lazy(() => DepartmentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DepartmentCreateWithoutPatientVisitInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutPatientVisitInputSchema) ]),
}).strict();

export const UserCreateWithoutPatientVisitInputSchema: z.ZodType<Prisma.UserCreateWithoutPatientVisitInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  isActive: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentCreateNestedManyWithoutDoctorInputSchema).optional(),
  Department: z.lazy(() => DepartmentCreateNestedOneWithoutUserInputSchema),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutUserInputSchema),
  UserLogin: z.lazy(() => UserLoginCreateNestedOneWithoutUserInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutPatientVisitInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutPatientVisitInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  hospitalId: z.number().int(),
  department: z.number().int(),
  isActive: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Assessment: z.lazy(() => AssessmentUncheckedCreateNestedManyWithoutDoctorInputSchema).optional(),
  UserLogin: z.lazy(() => UserLoginUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutPatientVisitInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutPatientVisitInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutPatientVisitInputSchema),z.lazy(() => UserUncheckedCreateWithoutPatientVisitInputSchema) ]),
}).strict();

export const HospitalCreateWithoutPatientVisitInputSchema: z.ZodType<Prisma.HospitalCreateWithoutPatientVisitInput> = z.object({
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentCreateNestedManyWithoutHospitalInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackCreateNestedManyWithoutHospitalInputSchema).optional(),
  Permission: z.lazy(() => PermissionCreateNestedManyWithoutHospitalInputSchema).optional(),
  Product: z.lazy(() => ProductCreateNestedManyWithoutHospitalInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentCreateNestedManyWithoutHospitalInputSchema).optional(),
  Role: z.lazy(() => RoleCreateNestedManyWithoutHospitalInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedManyWithoutHospitalInputSchema).optional(),
  Vendor: z.lazy(() => VendorCreateNestedManyWithoutHospitalInputSchema).optional()
}).strict();

export const HospitalUncheckedCreateWithoutPatientVisitInputSchema: z.ZodType<Prisma.HospitalUncheckedCreateWithoutPatientVisitInput> = z.object({
  id: z.number().int().optional(),
  hospitalName: z.string(),
  phoneNumber: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Permission: z.lazy(() => PermissionUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Role: z.lazy(() => RoleUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutHospitalInputSchema).optional(),
  Vendor: z.lazy(() => VendorUncheckedCreateNestedManyWithoutHospitalInputSchema).optional()
}).strict();

export const HospitalCreateOrConnectWithoutPatientVisitInputSchema: z.ZodType<Prisma.HospitalCreateOrConnectWithoutPatientVisitInput> = z.object({
  where: z.lazy(() => HospitalWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => HospitalCreateWithoutPatientVisitInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutPatientVisitInputSchema) ]),
}).strict();

export const PatientCreateWithoutPatientVisitInputSchema: z.ZodType<Prisma.PatientCreateWithoutPatientVisitInput> = z.object({
  uhid: z.string().optional(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  mobile: z.string(),
  hospitalId: z.number().int(),
  dob: z.coerce.date().optional().nullable(),
  bornYear: z.number().int().optional().nullable(),
  aadharNumber: z.string().optional().nullable(),
  aadharName: z.string().optional().nullable(),
  bloodGroup: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional(),
  fatherName: z.string(),
  Assessment: z.lazy(() => AssessmentCreateNestedManyWithoutPatientInputSchema).optional()
}).strict();

export const PatientUncheckedCreateWithoutPatientVisitInputSchema: z.ZodType<Prisma.PatientUncheckedCreateWithoutPatientVisitInput> = z.object({
  uhid: z.string().optional(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  mobile: z.string(),
  hospitalId: z.number().int(),
  dob: z.coerce.date().optional().nullable(),
  bornYear: z.number().int().optional().nullable(),
  aadharNumber: z.string().optional().nullable(),
  aadharName: z.string().optional().nullable(),
  bloodGroup: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional(),
  fatherName: z.string(),
  Assessment: z.lazy(() => AssessmentUncheckedCreateNestedManyWithoutPatientInputSchema).optional()
}).strict();

export const PatientCreateOrConnectWithoutPatientVisitInputSchema: z.ZodType<Prisma.PatientCreateOrConnectWithoutPatientVisitInput> = z.object({
  where: z.lazy(() => PatientWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PatientCreateWithoutPatientVisitInputSchema),z.lazy(() => PatientUncheckedCreateWithoutPatientVisitInputSchema) ]),
}).strict();

export const AssessmentUpsertWithoutPatientVisitInputSchema: z.ZodType<Prisma.AssessmentUpsertWithoutPatientVisitInput> = z.object({
  update: z.union([ z.lazy(() => AssessmentUpdateWithoutPatientVisitInputSchema),z.lazy(() => AssessmentUncheckedUpdateWithoutPatientVisitInputSchema) ]),
  create: z.union([ z.lazy(() => AssessmentCreateWithoutPatientVisitInputSchema),z.lazy(() => AssessmentUncheckedCreateWithoutPatientVisitInputSchema) ]),
  where: z.lazy(() => AssessmentWhereInputSchema).optional()
}).strict();

export const AssessmentUpdateToOneWithWhereWithoutPatientVisitInputSchema: z.ZodType<Prisma.AssessmentUpdateToOneWithWhereWithoutPatientVisitInput> = z.object({
  where: z.lazy(() => AssessmentWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AssessmentUpdateWithoutPatientVisitInputSchema),z.lazy(() => AssessmentUncheckedUpdateWithoutPatientVisitInputSchema) ]),
}).strict();

export const AssessmentUpdateWithoutPatientVisitInputSchema: z.ZodType<Prisma.AssessmentUpdateWithoutPatientVisitInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  complaint: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currentMedication: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pastMedicalHistory: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  examination: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investigation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  procedureDone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  treatmentGiven: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  followUp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  followupInstruction: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Doctor: z.lazy(() => UserUpdateOneRequiredWithoutAssessmentNestedInputSchema).optional(),
  Patient: z.lazy(() => PatientUpdateOneRequiredWithoutAssessmentNestedInputSchema).optional()
}).strict();

export const AssessmentUncheckedUpdateWithoutPatientVisitInputSchema: z.ZodType<Prisma.AssessmentUncheckedUpdateWithoutPatientVisitInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  doctorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  complaint: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currentMedication: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pastMedicalHistory: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  examination: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investigation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  procedureDone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  treatmentGiven: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  followUp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  followupInstruction: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DepartmentUpsertWithoutPatientVisitInputSchema: z.ZodType<Prisma.DepartmentUpsertWithoutPatientVisitInput> = z.object({
  update: z.union([ z.lazy(() => DepartmentUpdateWithoutPatientVisitInputSchema),z.lazy(() => DepartmentUncheckedUpdateWithoutPatientVisitInputSchema) ]),
  create: z.union([ z.lazy(() => DepartmentCreateWithoutPatientVisitInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutPatientVisitInputSchema) ]),
  where: z.lazy(() => DepartmentWhereInputSchema).optional()
}).strict();

export const DepartmentUpdateToOneWithWhereWithoutPatientVisitInputSchema: z.ZodType<Prisma.DepartmentUpdateToOneWithWhereWithoutPatientVisitInput> = z.object({
  where: z.lazy(() => DepartmentWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DepartmentUpdateWithoutPatientVisitInputSchema),z.lazy(() => DepartmentUncheckedUpdateWithoutPatientVisitInputSchema) ]),
}).strict();

export const DepartmentUpdateWithoutPatientVisitInputSchema: z.ZodType<Prisma.DepartmentUpdateWithoutPatientVisitInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutDepartmentNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUpdateOneRequiredWithoutDepartmentNestedInputSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUpdateManyWithoutDepartmentNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateManyWithoutDepartmentNestedInputSchema).optional()
}).strict();

export const DepartmentUncheckedUpdateWithoutPatientVisitInputSchema: z.ZodType<Prisma.DepartmentUncheckedUpdateWithoutPatientVisitInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUncheckedUpdateManyWithoutDepartmentNestedInputSchema).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutDepartmentNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutPatientVisitInputSchema: z.ZodType<Prisma.UserUpsertWithoutPatientVisitInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutPatientVisitInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPatientVisitInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutPatientVisitInputSchema),z.lazy(() => UserUncheckedCreateWithoutPatientVisitInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutPatientVisitInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutPatientVisitInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutPatientVisitInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPatientVisitInputSchema) ]),
}).strict();

export const UserUpdateWithoutPatientVisitInputSchema: z.ZodType<Prisma.UserUpdateWithoutPatientVisitInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUpdateManyWithoutDoctorNestedInputSchema).optional(),
  Department: z.lazy(() => DepartmentUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  UserLogin: z.lazy(() => UserLoginUpdateOneWithoutUserNestedInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutPatientVisitInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutPatientVisitInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  department: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUncheckedUpdateManyWithoutDoctorNestedInputSchema).optional(),
  UserLogin: z.lazy(() => UserLoginUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const HospitalUpsertWithoutPatientVisitInputSchema: z.ZodType<Prisma.HospitalUpsertWithoutPatientVisitInput> = z.object({
  update: z.union([ z.lazy(() => HospitalUpdateWithoutPatientVisitInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutPatientVisitInputSchema) ]),
  create: z.union([ z.lazy(() => HospitalCreateWithoutPatientVisitInputSchema),z.lazy(() => HospitalUncheckedCreateWithoutPatientVisitInputSchema) ]),
  where: z.lazy(() => HospitalWhereInputSchema).optional()
}).strict();

export const HospitalUpdateToOneWithWhereWithoutPatientVisitInputSchema: z.ZodType<Prisma.HospitalUpdateToOneWithWhereWithoutPatientVisitInput> = z.object({
  where: z.lazy(() => HospitalWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => HospitalUpdateWithoutPatientVisitInputSchema),z.lazy(() => HospitalUncheckedUpdateWithoutPatientVisitInputSchema) ]),
}).strict();

export const HospitalUpdateWithoutPatientVisitInputSchema: z.ZodType<Prisma.HospitalUpdateWithoutPatientVisitInput> = z.object({
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUpdateManyWithoutHospitalNestedInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Permission: z.lazy(() => PermissionUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUpdateManyWithoutHospitalNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUpdateManyWithoutHospitalNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Vendor: z.lazy(() => VendorUpdateManyWithoutHospitalNestedInputSchema).optional()
}).strict();

export const HospitalUncheckedUpdateWithoutPatientVisitInputSchema: z.ZodType<Prisma.HospitalUncheckedUpdateWithoutPatientVisitInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  IntentTrack: z.lazy(() => IntentTrackUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Permission: z.lazy(() => PermissionUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional(),
  Vendor: z.lazy(() => VendorUncheckedUpdateManyWithoutHospitalNestedInputSchema).optional()
}).strict();

export const PatientUpsertWithoutPatientVisitInputSchema: z.ZodType<Prisma.PatientUpsertWithoutPatientVisitInput> = z.object({
  update: z.union([ z.lazy(() => PatientUpdateWithoutPatientVisitInputSchema),z.lazy(() => PatientUncheckedUpdateWithoutPatientVisitInputSchema) ]),
  create: z.union([ z.lazy(() => PatientCreateWithoutPatientVisitInputSchema),z.lazy(() => PatientUncheckedCreateWithoutPatientVisitInputSchema) ]),
  where: z.lazy(() => PatientWhereInputSchema).optional()
}).strict();

export const PatientUpdateToOneWithWhereWithoutPatientVisitInputSchema: z.ZodType<Prisma.PatientUpdateToOneWithWhereWithoutPatientVisitInput> = z.object({
  where: z.lazy(() => PatientWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PatientUpdateWithoutPatientVisitInputSchema),z.lazy(() => PatientUncheckedUpdateWithoutPatientVisitInputSchema) ]),
}).strict();

export const PatientUpdateWithoutPatientVisitInputSchema: z.ZodType<Prisma.PatientUpdateWithoutPatientVisitInput> = z.object({
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  mobile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bornYear: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aadharNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aadharName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bloodGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pincode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  fatherName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUpdateManyWithoutPatientNestedInputSchema).optional()
}).strict();

export const PatientUncheckedUpdateWithoutPatientVisitInputSchema: z.ZodType<Prisma.PatientUncheckedUpdateWithoutPatientVisitInput> = z.object({
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  mobile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bornYear: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aadharNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aadharName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bloodGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pincode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  fatherName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUncheckedUpdateManyWithoutPatientNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutAssessmentInputSchema: z.ZodType<Prisma.UserCreateWithoutAssessmentInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  isActive: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutDoctorInputSchema).optional(),
  Department: z.lazy(() => DepartmentCreateNestedOneWithoutUserInputSchema),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutUserInputSchema),
  UserLogin: z.lazy(() => UserLoginCreateNestedOneWithoutUserInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutAssessmentInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAssessmentInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  hospitalId: z.number().int(),
  department: z.number().int(),
  isActive: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutDoctorInputSchema).optional(),
  UserLogin: z.lazy(() => UserLoginUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutAssessmentInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAssessmentInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAssessmentInputSchema),z.lazy(() => UserUncheckedCreateWithoutAssessmentInputSchema) ]),
}).strict();

export const PatientVisitCreateWithoutAssessmentInputSchema: z.ZodType<Prisma.PatientVisitCreateWithoutAssessmentInput> = z.object({
  id: z.string().optional(),
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Department: z.lazy(() => DepartmentCreateNestedOneWithoutPatientVisitInputSchema),
  Doctor: z.lazy(() => UserCreateNestedOneWithoutPatientVisitInputSchema),
  Hospital: z.lazy(() => HospitalCreateNestedOneWithoutPatientVisitInputSchema),
  Patient: z.lazy(() => PatientCreateNestedOneWithoutPatientVisitInputSchema)
}).strict();

export const PatientVisitUncheckedCreateWithoutAssessmentInputSchema: z.ZodType<Prisma.PatientVisitUncheckedCreateWithoutAssessmentInput> = z.object({
  id: z.string().optional(),
  uhid: z.string(),
  hospitalId: z.number().int(),
  departmentId: z.number().int(),
  doctorId: z.string(),
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PatientVisitCreateOrConnectWithoutAssessmentInputSchema: z.ZodType<Prisma.PatientVisitCreateOrConnectWithoutAssessmentInput> = z.object({
  where: z.lazy(() => PatientVisitWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutAssessmentInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutAssessmentInputSchema) ]),
}).strict();

export const PatientCreateWithoutAssessmentInputSchema: z.ZodType<Prisma.PatientCreateWithoutAssessmentInput> = z.object({
  uhid: z.string().optional(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  mobile: z.string(),
  hospitalId: z.number().int(),
  dob: z.coerce.date().optional().nullable(),
  bornYear: z.number().int().optional().nullable(),
  aadharNumber: z.string().optional().nullable(),
  aadharName: z.string().optional().nullable(),
  bloodGroup: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional(),
  fatherName: z.string(),
  PatientVisit: z.lazy(() => PatientVisitCreateNestedManyWithoutPatientInputSchema).optional()
}).strict();

export const PatientUncheckedCreateWithoutAssessmentInputSchema: z.ZodType<Prisma.PatientUncheckedCreateWithoutAssessmentInput> = z.object({
  uhid: z.string().optional(),
  name: z.string(),
  gender: z.lazy(() => GenderSchema),
  mobile: z.string(),
  hospitalId: z.number().int(),
  dob: z.coerce.date().optional().nullable(),
  bornYear: z.number().int().optional().nullable(),
  aadharNumber: z.string().optional().nullable(),
  aadharName: z.string().optional().nullable(),
  bloodGroup: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional(),
  fatherName: z.string(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedCreateNestedManyWithoutPatientInputSchema).optional()
}).strict();

export const PatientCreateOrConnectWithoutAssessmentInputSchema: z.ZodType<Prisma.PatientCreateOrConnectWithoutAssessmentInput> = z.object({
  where: z.lazy(() => PatientWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PatientCreateWithoutAssessmentInputSchema),z.lazy(() => PatientUncheckedCreateWithoutAssessmentInputSchema) ]),
}).strict();

export const UserUpsertWithoutAssessmentInputSchema: z.ZodType<Prisma.UserUpsertWithoutAssessmentInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutAssessmentInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAssessmentInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutAssessmentInputSchema),z.lazy(() => UserUncheckedCreateWithoutAssessmentInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutAssessmentInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAssessmentInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutAssessmentInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAssessmentInputSchema) ]),
}).strict();

export const UserUpdateWithoutAssessmentInputSchema: z.ZodType<Prisma.UserUpdateWithoutAssessmentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutDoctorNestedInputSchema).optional(),
  Department: z.lazy(() => DepartmentUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  UserLogin: z.lazy(() => UserLoginUpdateOneWithoutUserNestedInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutAssessmentInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAssessmentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  department: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutDoctorNestedInputSchema).optional(),
  UserLogin: z.lazy(() => UserLoginUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const PatientVisitUpsertWithoutAssessmentInputSchema: z.ZodType<Prisma.PatientVisitUpsertWithoutAssessmentInput> = z.object({
  update: z.union([ z.lazy(() => PatientVisitUpdateWithoutAssessmentInputSchema),z.lazy(() => PatientVisitUncheckedUpdateWithoutAssessmentInputSchema) ]),
  create: z.union([ z.lazy(() => PatientVisitCreateWithoutAssessmentInputSchema),z.lazy(() => PatientVisitUncheckedCreateWithoutAssessmentInputSchema) ]),
  where: z.lazy(() => PatientVisitWhereInputSchema).optional()
}).strict();

export const PatientVisitUpdateToOneWithWhereWithoutAssessmentInputSchema: z.ZodType<Prisma.PatientVisitUpdateToOneWithWhereWithoutAssessmentInput> = z.object({
  where: z.lazy(() => PatientVisitWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PatientVisitUpdateWithoutAssessmentInputSchema),z.lazy(() => PatientVisitUncheckedUpdateWithoutAssessmentInputSchema) ]),
}).strict();

export const PatientVisitUpdateWithoutAssessmentInputSchema: z.ZodType<Prisma.PatientVisitUpdateWithoutAssessmentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  checkInTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  checkOutTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUpdateOneRequiredWithoutPatientVisitNestedInputSchema).optional(),
  Doctor: z.lazy(() => UserUpdateOneRequiredWithoutPatientVisitNestedInputSchema).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutPatientVisitNestedInputSchema).optional(),
  Patient: z.lazy(() => PatientUpdateOneRequiredWithoutPatientVisitNestedInputSchema).optional()
}).strict();

export const PatientVisitUncheckedUpdateWithoutAssessmentInputSchema: z.ZodType<Prisma.PatientVisitUncheckedUpdateWithoutAssessmentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  departmentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  doctorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  checkInTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  checkOutTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PatientUpsertWithoutAssessmentInputSchema: z.ZodType<Prisma.PatientUpsertWithoutAssessmentInput> = z.object({
  update: z.union([ z.lazy(() => PatientUpdateWithoutAssessmentInputSchema),z.lazy(() => PatientUncheckedUpdateWithoutAssessmentInputSchema) ]),
  create: z.union([ z.lazy(() => PatientCreateWithoutAssessmentInputSchema),z.lazy(() => PatientUncheckedCreateWithoutAssessmentInputSchema) ]),
  where: z.lazy(() => PatientWhereInputSchema).optional()
}).strict();

export const PatientUpdateToOneWithWhereWithoutAssessmentInputSchema: z.ZodType<Prisma.PatientUpdateToOneWithWhereWithoutAssessmentInput> = z.object({
  where: z.lazy(() => PatientWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PatientUpdateWithoutAssessmentInputSchema),z.lazy(() => PatientUncheckedUpdateWithoutAssessmentInputSchema) ]),
}).strict();

export const PatientUpdateWithoutAssessmentInputSchema: z.ZodType<Prisma.PatientUpdateWithoutAssessmentInput> = z.object({
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  mobile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bornYear: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aadharNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aadharName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bloodGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pincode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  fatherName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutPatientNestedInputSchema).optional()
}).strict();

export const PatientUncheckedUpdateWithoutAssessmentInputSchema: z.ZodType<Prisma.PatientUncheckedUpdateWithoutAssessmentInput> = z.object({
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => EnumGenderFieldUpdateOperationsInputSchema) ]).optional(),
  mobile: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dob: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bornYear: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aadharNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  aadharName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bloodGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pincode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  fatherName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutPatientNestedInputSchema).optional()
}).strict();

export const DepartmentCreateManyHospitalInputSchema: z.ZodType<Prisma.DepartmentCreateManyHospitalInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  roleId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const IntentTrackCreateManyHospitalInputSchema: z.ZodType<Prisma.IntentTrackCreateManyHospitalInput> = z.object({
  id: z.number().int().optional(),
  statusId: z.number().int(),
  color: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PatientVisitCreateManyHospitalInputSchema: z.ZodType<Prisma.PatientVisitCreateManyHospitalInput> = z.object({
  id: z.string().optional(),
  uhid: z.string(),
  departmentId: z.number().int(),
  doctorId: z.string(),
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PermissionCreateManyHospitalInputSchema: z.ZodType<Prisma.PermissionCreateManyHospitalInput> = z.object({
  id: z.number().int().optional(),
  permissionName: z.string(),
  description: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductCreateManyHospitalInputSchema: z.ZodType<Prisma.ProductCreateManyHospitalInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  sku: z.string(),
  hsnCode: z.string(),
  genericName: z.string(),
  brandName: z.string(),
  manufacturer: z.string(),
  dosageForm: z.string(),
  strength: z.string(),
  purchaseRate: z.number(),
  saleRate: z.number(),
  mrp: z.number(),
  maxDiscount: z.number(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductIntentCreateManyHospitalInputSchema: z.ZodType<Prisma.ProductIntentCreateManyHospitalInput> = z.object({
  id: z.string().optional(),
  productId: z.string(),
  intentId: z.number().int(),
  trackId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const RoleCreateManyHospitalInputSchema: z.ZodType<Prisma.RoleCreateManyHospitalInput> = z.object({
  id: z.number().int().optional(),
  roleName: z.string(),
  description: z.string().optional().nullable(),
  isSuperAdmin: z.boolean().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserCreateManyHospitalInputSchema: z.ZodType<Prisma.UserCreateManyHospitalInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  department: z.number().int(),
  isActive: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const VendorCreateManyHospitalInputSchema: z.ZodType<Prisma.VendorCreateManyHospitalInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  address: z.string(),
  gstNumber: z.string(),
  branchName: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const DepartmentUpdateWithoutHospitalInputSchema: z.ZodType<Prisma.DepartmentUpdateWithoutHospitalInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Role: z.lazy(() => RoleUpdateOneRequiredWithoutDepartmentNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutDepartmentNestedInputSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUpdateManyWithoutDepartmentNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateManyWithoutDepartmentNestedInputSchema).optional()
}).strict();

export const DepartmentUncheckedUpdateWithoutHospitalInputSchema: z.ZodType<Prisma.DepartmentUncheckedUpdateWithoutHospitalInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutDepartmentNestedInputSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUncheckedUpdateManyWithoutDepartmentNestedInputSchema).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutDepartmentNestedInputSchema).optional()
}).strict();

export const DepartmentUncheckedUpdateManyWithoutHospitalInputSchema: z.ZodType<Prisma.DepartmentUncheckedUpdateManyWithoutHospitalInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntentTrackUpdateWithoutHospitalInputSchema: z.ZodType<Prisma.IntentTrackUpdateWithoutHospitalInput> = z.object({
  color: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  IntentStatus: z.lazy(() => IntentStatusUpdateOneRequiredWithoutTracksNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUpdateManyWithoutTrackNestedInputSchema).optional()
}).strict();

export const IntentTrackUncheckedUpdateWithoutHospitalInputSchema: z.ZodType<Prisma.IntentTrackUncheckedUpdateWithoutHospitalInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  statusId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  color: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedUpdateManyWithoutTrackNestedInputSchema).optional()
}).strict();

export const IntentTrackUncheckedUpdateManyWithoutHospitalInputSchema: z.ZodType<Prisma.IntentTrackUncheckedUpdateManyWithoutHospitalInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  statusId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  color: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PatientVisitUpdateWithoutHospitalInputSchema: z.ZodType<Prisma.PatientVisitUpdateWithoutHospitalInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  checkInTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  checkOutTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUpdateOneWithoutPatientVisitNestedInputSchema).optional(),
  Department: z.lazy(() => DepartmentUpdateOneRequiredWithoutPatientVisitNestedInputSchema).optional(),
  Doctor: z.lazy(() => UserUpdateOneRequiredWithoutPatientVisitNestedInputSchema).optional(),
  Patient: z.lazy(() => PatientUpdateOneRequiredWithoutPatientVisitNestedInputSchema).optional()
}).strict();

export const PatientVisitUncheckedUpdateWithoutHospitalInputSchema: z.ZodType<Prisma.PatientVisitUncheckedUpdateWithoutHospitalInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  departmentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  doctorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  checkInTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  checkOutTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUncheckedUpdateOneWithoutPatientVisitNestedInputSchema).optional()
}).strict();

export const PatientVisitUncheckedUpdateManyWithoutHospitalInputSchema: z.ZodType<Prisma.PatientVisitUncheckedUpdateManyWithoutHospitalInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  departmentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  doctorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  checkInTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  checkOutTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PermissionUpdateWithoutHospitalInputSchema: z.ZodType<Prisma.PermissionUpdateWithoutHospitalInput> = z.object({
  permissionName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  rolePermissions: z.lazy(() => RolePermissionUpdateManyWithoutPermissionNestedInputSchema).optional()
}).strict();

export const PermissionUncheckedUpdateWithoutHospitalInputSchema: z.ZodType<Prisma.PermissionUncheckedUpdateWithoutHospitalInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  permissionName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  rolePermissions: z.lazy(() => RolePermissionUncheckedUpdateManyWithoutPermissionNestedInputSchema).optional()
}).strict();

export const PermissionUncheckedUpdateManyWithoutHospitalInputSchema: z.ZodType<Prisma.PermissionUncheckedUpdateManyWithoutHospitalInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  permissionName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductUpdateWithoutHospitalInputSchema: z.ZodType<Prisma.ProductUpdateWithoutHospitalInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hsnCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  genericName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brandName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  manufacturer: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dosageForm: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  strength: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  purchaseRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  saleRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  mrp: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  maxDiscount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUpdateManyWithoutProductNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const ProductUncheckedUpdateWithoutHospitalInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateWithoutHospitalInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hsnCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  genericName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brandName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  manufacturer: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dosageForm: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  strength: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  purchaseRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  saleRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  mrp: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  maxDiscount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUncheckedUpdateManyWithoutProductNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const ProductUncheckedUpdateManyWithoutHospitalInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutHospitalInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sku: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hsnCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  genericName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  brandName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  manufacturer: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dosageForm: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  strength: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  purchaseRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  saleRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  mrp: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  maxDiscount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductIntentUpdateWithoutHospitalInputSchema: z.ZodType<Prisma.ProductIntentUpdateWithoutHospitalInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Intent: z.lazy(() => IntentStatusUpdateOneRequiredWithoutProductIntentNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUpdateOneRequiredWithoutProductIntentNestedInputSchema).optional(),
  Track: z.lazy(() => IntentTrackUpdateOneRequiredWithoutProductIntentNestedInputSchema).optional()
}).strict();

export const ProductIntentUncheckedUpdateWithoutHospitalInputSchema: z.ZodType<Prisma.ProductIntentUncheckedUpdateWithoutHospitalInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  intentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  trackId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductIntentUncheckedUpdateManyWithoutHospitalInputSchema: z.ZodType<Prisma.ProductIntentUncheckedUpdateManyWithoutHospitalInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  intentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  trackId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RoleUpdateWithoutHospitalInputSchema: z.ZodType<Prisma.RoleUpdateWithoutHospitalInput> = z.object({
  roleName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isSuperAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUpdateManyWithoutRoleNestedInputSchema).optional(),
  permissions: z.lazy(() => RolePermissionUpdateManyWithoutRoleNestedInputSchema).optional(),
  roleUsers: z.lazy(() => UserRoleUpdateManyWithoutRoleNestedInputSchema).optional()
}).strict();

export const RoleUncheckedUpdateWithoutHospitalInputSchema: z.ZodType<Prisma.RoleUncheckedUpdateWithoutHospitalInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  roleName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isSuperAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUncheckedUpdateManyWithoutRoleNestedInputSchema).optional(),
  permissions: z.lazy(() => RolePermissionUncheckedUpdateManyWithoutRoleNestedInputSchema).optional(),
  roleUsers: z.lazy(() => UserRoleUncheckedUpdateManyWithoutRoleNestedInputSchema).optional()
}).strict();

export const RoleUncheckedUpdateManyWithoutHospitalInputSchema: z.ZodType<Prisma.RoleUncheckedUpdateManyWithoutHospitalInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  roleName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isSuperAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUpdateWithoutHospitalInputSchema: z.ZodType<Prisma.UserUpdateWithoutHospitalInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUpdateManyWithoutDoctorNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutDoctorNestedInputSchema).optional(),
  Department: z.lazy(() => DepartmentUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  UserLogin: z.lazy(() => UserLoginUpdateOneWithoutUserNestedInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutHospitalInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutHospitalInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  department: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUncheckedUpdateManyWithoutDoctorNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutDoctorNestedInputSchema).optional(),
  UserLogin: z.lazy(() => UserLoginUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateManyWithoutHospitalInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutHospitalInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  department: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VendorUpdateWithoutHospitalInputSchema: z.ZodType<Prisma.VendorUpdateWithoutHospitalInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gstNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  branchName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VendorUncheckedUpdateWithoutHospitalInputSchema: z.ZodType<Prisma.VendorUncheckedUpdateWithoutHospitalInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gstNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  branchName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VendorUncheckedUpdateManyWithoutHospitalInputSchema: z.ZodType<Prisma.VendorUncheckedUpdateManyWithoutHospitalInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  gstNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  branchName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PatientVisitCreateManyDepartmentInputSchema: z.ZodType<Prisma.PatientVisitCreateManyDepartmentInput> = z.object({
  id: z.string().optional(),
  uhid: z.string(),
  hospitalId: z.number().int(),
  doctorId: z.string(),
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductDepartmentCreateManyDepartmentInputSchema: z.ZodType<Prisma.ProductDepartmentCreateManyDepartmentInput> = z.object({
  id: z.number().int().optional(),
  productId: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserCreateManyDepartmentInputSchema: z.ZodType<Prisma.UserCreateManyDepartmentInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  hospitalId: z.number().int(),
  isActive: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PatientVisitUpdateWithoutDepartmentInputSchema: z.ZodType<Prisma.PatientVisitUpdateWithoutDepartmentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  checkInTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  checkOutTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUpdateOneWithoutPatientVisitNestedInputSchema).optional(),
  Doctor: z.lazy(() => UserUpdateOneRequiredWithoutPatientVisitNestedInputSchema).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutPatientVisitNestedInputSchema).optional(),
  Patient: z.lazy(() => PatientUpdateOneRequiredWithoutPatientVisitNestedInputSchema).optional()
}).strict();

export const PatientVisitUncheckedUpdateWithoutDepartmentInputSchema: z.ZodType<Prisma.PatientVisitUncheckedUpdateWithoutDepartmentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  doctorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  checkInTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  checkOutTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUncheckedUpdateOneWithoutPatientVisitNestedInputSchema).optional()
}).strict();

export const PatientVisitUncheckedUpdateManyWithoutDepartmentInputSchema: z.ZodType<Prisma.PatientVisitUncheckedUpdateManyWithoutDepartmentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  doctorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  checkInTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  checkOutTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductDepartmentUpdateWithoutDepartmentInputSchema: z.ZodType<Prisma.ProductDepartmentUpdateWithoutDepartmentInput> = z.object({
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Product: z.lazy(() => ProductUpdateOneRequiredWithoutProductDepartmentNestedInputSchema).optional()
}).strict();

export const ProductDepartmentUncheckedUpdateWithoutDepartmentInputSchema: z.ZodType<Prisma.ProductDepartmentUncheckedUpdateWithoutDepartmentInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductDepartmentUncheckedUpdateManyWithoutDepartmentInputSchema: z.ZodType<Prisma.ProductDepartmentUncheckedUpdateManyWithoutDepartmentInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUpdateWithoutDepartmentInputSchema: z.ZodType<Prisma.UserUpdateWithoutDepartmentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUpdateManyWithoutDoctorNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutDoctorNestedInputSchema).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  UserLogin: z.lazy(() => UserLoginUpdateOneWithoutUserNestedInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutDepartmentInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutDepartmentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUncheckedUpdateManyWithoutDoctorNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutDoctorNestedInputSchema).optional(),
  UserLogin: z.lazy(() => UserLoginUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  UserRole: z.lazy(() => UserRoleUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateManyWithoutDepartmentInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutDepartmentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phoneNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AssessmentCreateManyDoctorInputSchema: z.ZodType<Prisma.AssessmentCreateManyDoctorInput> = z.object({
  id: z.string().optional(),
  uhid: z.string(),
  patientVisitId: z.string(),
  complaint: z.string(),
  currentMedication: z.string(),
  pastMedicalHistory: z.string(),
  examination: z.string(),
  investigation: z.string(),
  procedureDone: z.string(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  treatmentGiven: z.string(),
  followUp: z.coerce.date(),
  followupInstruction: z.string(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PatientVisitCreateManyDoctorInputSchema: z.ZodType<Prisma.PatientVisitCreateManyDoctorInput> = z.object({
  id: z.string().optional(),
  uhid: z.string(),
  hospitalId: z.number().int(),
  departmentId: z.number().int(),
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserRoleCreateManyUserInputSchema: z.ZodType<Prisma.UserRoleCreateManyUserInput> = z.object({
  id: z.number().int().optional(),
  roleId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const AssessmentUpdateWithoutDoctorInputSchema: z.ZodType<Prisma.AssessmentUpdateWithoutDoctorInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  complaint: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currentMedication: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pastMedicalHistory: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  examination: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investigation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  procedureDone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  treatmentGiven: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  followUp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  followupInstruction: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateOneRequiredWithoutAssessmentNestedInputSchema).optional(),
  Patient: z.lazy(() => PatientUpdateOneRequiredWithoutAssessmentNestedInputSchema).optional()
}).strict();

export const AssessmentUncheckedUpdateWithoutDoctorInputSchema: z.ZodType<Prisma.AssessmentUncheckedUpdateWithoutDoctorInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  patientVisitId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  complaint: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currentMedication: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pastMedicalHistory: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  examination: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investigation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  procedureDone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  treatmentGiven: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  followUp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  followupInstruction: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AssessmentUncheckedUpdateManyWithoutDoctorInputSchema: z.ZodType<Prisma.AssessmentUncheckedUpdateManyWithoutDoctorInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  patientVisitId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  complaint: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currentMedication: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pastMedicalHistory: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  examination: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investigation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  procedureDone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  treatmentGiven: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  followUp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  followupInstruction: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PatientVisitUpdateWithoutDoctorInputSchema: z.ZodType<Prisma.PatientVisitUpdateWithoutDoctorInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  checkInTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  checkOutTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUpdateOneWithoutPatientVisitNestedInputSchema).optional(),
  Department: z.lazy(() => DepartmentUpdateOneRequiredWithoutPatientVisitNestedInputSchema).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutPatientVisitNestedInputSchema).optional(),
  Patient: z.lazy(() => PatientUpdateOneRequiredWithoutPatientVisitNestedInputSchema).optional()
}).strict();

export const PatientVisitUncheckedUpdateWithoutDoctorInputSchema: z.ZodType<Prisma.PatientVisitUncheckedUpdateWithoutDoctorInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  departmentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  checkInTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  checkOutTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUncheckedUpdateOneWithoutPatientVisitNestedInputSchema).optional()
}).strict();

export const PatientVisitUncheckedUpdateManyWithoutDoctorInputSchema: z.ZodType<Prisma.PatientVisitUncheckedUpdateManyWithoutDoctorInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uhid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  departmentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  checkInTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  checkOutTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserRoleUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserRoleUpdateWithoutUserInput> = z.object({
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.lazy(() => RoleUpdateOneRequiredWithoutRoleUsersNestedInputSchema).optional()
}).strict();

export const UserRoleUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserRoleUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserRoleUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.UserRoleUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DepartmentCreateManyRoleInputSchema: z.ZodType<Prisma.DepartmentCreateManyRoleInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  hospitalId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const RolePermissionCreateManyRoleInputSchema: z.ZodType<Prisma.RolePermissionCreateManyRoleInput> = z.object({
  id: z.number().int().optional(),
  permissionId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserRoleCreateManyRoleInputSchema: z.ZodType<Prisma.UserRoleCreateManyRoleInput> = z.object({
  id: z.number().int().optional(),
  userId: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const DepartmentUpdateWithoutRoleInputSchema: z.ZodType<Prisma.DepartmentUpdateWithoutRoleInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutDepartmentNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateManyWithoutDepartmentNestedInputSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUpdateManyWithoutDepartmentNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateManyWithoutDepartmentNestedInputSchema).optional()
}).strict();

export const DepartmentUncheckedUpdateWithoutRoleInputSchema: z.ZodType<Prisma.DepartmentUncheckedUpdateWithoutRoleInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  PatientVisit: z.lazy(() => PatientVisitUncheckedUpdateManyWithoutDepartmentNestedInputSchema).optional(),
  ProductDepartment: z.lazy(() => ProductDepartmentUncheckedUpdateManyWithoutDepartmentNestedInputSchema).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutDepartmentNestedInputSchema).optional()
}).strict();

export const DepartmentUncheckedUpdateManyWithoutRoleInputSchema: z.ZodType<Prisma.DepartmentUncheckedUpdateManyWithoutRoleInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RolePermissionUpdateWithoutRoleInputSchema: z.ZodType<Prisma.RolePermissionUpdateWithoutRoleInput> = z.object({
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  permission: z.lazy(() => PermissionUpdateOneRequiredWithoutRolePermissionsNestedInputSchema).optional()
}).strict();

export const RolePermissionUncheckedUpdateWithoutRoleInputSchema: z.ZodType<Prisma.RolePermissionUncheckedUpdateWithoutRoleInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  permissionId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RolePermissionUncheckedUpdateManyWithoutRoleInputSchema: z.ZodType<Prisma.RolePermissionUncheckedUpdateManyWithoutRoleInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  permissionId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserRoleUpdateWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleUpdateWithoutRoleInput> = z.object({
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutUserRoleNestedInputSchema).optional()
}).strict();

export const UserRoleUncheckedUpdateWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleUncheckedUpdateWithoutRoleInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserRoleUncheckedUpdateManyWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleUncheckedUpdateManyWithoutRoleInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RolePermissionCreateManyPermissionInputSchema: z.ZodType<Prisma.RolePermissionCreateManyPermissionInput> = z.object({
  id: z.number().int().optional(),
  roleId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const RolePermissionUpdateWithoutPermissionInputSchema: z.ZodType<Prisma.RolePermissionUpdateWithoutPermissionInput> = z.object({
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.lazy(() => RoleUpdateOneRequiredWithoutPermissionsNestedInputSchema).optional()
}).strict();

export const RolePermissionUncheckedUpdateWithoutPermissionInputSchema: z.ZodType<Prisma.RolePermissionUncheckedUpdateWithoutPermissionInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RolePermissionUncheckedUpdateManyWithoutPermissionInputSchema: z.ZodType<Prisma.RolePermissionUncheckedUpdateManyWithoutPermissionInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductDepartmentCreateManyProductInputSchema: z.ZodType<Prisma.ProductDepartmentCreateManyProductInput> = z.object({
  id: z.number().int().optional(),
  departmentId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductIntentCreateManyProductInputSchema: z.ZodType<Prisma.ProductIntentCreateManyProductInput> = z.object({
  id: z.string().optional(),
  intentId: z.number().int(),
  trackId: z.number().int(),
  hospitalId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductDepartmentUpdateWithoutProductInputSchema: z.ZodType<Prisma.ProductDepartmentUpdateWithoutProductInput> = z.object({
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Department: z.lazy(() => DepartmentUpdateOneRequiredWithoutProductDepartmentNestedInputSchema).optional()
}).strict();

export const ProductDepartmentUncheckedUpdateWithoutProductInputSchema: z.ZodType<Prisma.ProductDepartmentUncheckedUpdateWithoutProductInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  departmentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductDepartmentUncheckedUpdateManyWithoutProductInputSchema: z.ZodType<Prisma.ProductDepartmentUncheckedUpdateManyWithoutProductInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  departmentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductIntentUpdateWithoutProductInputSchema: z.ZodType<Prisma.ProductIntentUpdateWithoutProductInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutProductIntentNestedInputSchema).optional(),
  Intent: z.lazy(() => IntentStatusUpdateOneRequiredWithoutProductIntentNestedInputSchema).optional(),
  Track: z.lazy(() => IntentTrackUpdateOneRequiredWithoutProductIntentNestedInputSchema).optional()
}).strict();

export const ProductIntentUncheckedUpdateWithoutProductInputSchema: z.ZodType<Prisma.ProductIntentUncheckedUpdateWithoutProductInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  intentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  trackId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductIntentUncheckedUpdateManyWithoutProductInputSchema: z.ZodType<Prisma.ProductIntentUncheckedUpdateManyWithoutProductInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  intentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  trackId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductIntentCreateManyTrackInputSchema: z.ZodType<Prisma.ProductIntentCreateManyTrackInput> = z.object({
  id: z.string().optional(),
  productId: z.string(),
  intentId: z.number().int(),
  hospitalId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductIntentUpdateWithoutTrackInputSchema: z.ZodType<Prisma.ProductIntentUpdateWithoutTrackInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutProductIntentNestedInputSchema).optional(),
  Intent: z.lazy(() => IntentStatusUpdateOneRequiredWithoutProductIntentNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUpdateOneRequiredWithoutProductIntentNestedInputSchema).optional()
}).strict();

export const ProductIntentUncheckedUpdateWithoutTrackInputSchema: z.ZodType<Prisma.ProductIntentUncheckedUpdateWithoutTrackInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  intentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductIntentUncheckedUpdateManyWithoutTrackInputSchema: z.ZodType<Prisma.ProductIntentUncheckedUpdateManyWithoutTrackInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  intentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntentTrackCreateManyIntentStatusInputSchema: z.ZodType<Prisma.IntentTrackCreateManyIntentStatusInput> = z.object({
  id: z.number().int().optional(),
  hospitalId: z.number().int(),
  color: z.string(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProductIntentCreateManyIntentInputSchema: z.ZodType<Prisma.ProductIntentCreateManyIntentInput> = z.object({
  id: z.string().optional(),
  productId: z.string(),
  trackId: z.number().int(),
  hospitalId: z.number().int(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const IntentTrackUpdateWithoutIntentStatusInputSchema: z.ZodType<Prisma.IntentTrackUpdateWithoutIntentStatusInput> = z.object({
  color: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutIntentTrackNestedInputSchema).optional(),
  ProductIntent: z.lazy(() => ProductIntentUpdateManyWithoutTrackNestedInputSchema).optional()
}).strict();

export const IntentTrackUncheckedUpdateWithoutIntentStatusInputSchema: z.ZodType<Prisma.IntentTrackUncheckedUpdateWithoutIntentStatusInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  color: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ProductIntent: z.lazy(() => ProductIntentUncheckedUpdateManyWithoutTrackNestedInputSchema).optional()
}).strict();

export const IntentTrackUncheckedUpdateManyWithoutIntentStatusInputSchema: z.ZodType<Prisma.IntentTrackUncheckedUpdateManyWithoutIntentStatusInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  color: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductIntentUpdateWithoutIntentInputSchema: z.ZodType<Prisma.ProductIntentUpdateWithoutIntentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutProductIntentNestedInputSchema).optional(),
  Product: z.lazy(() => ProductUpdateOneRequiredWithoutProductIntentNestedInputSchema).optional(),
  Track: z.lazy(() => IntentTrackUpdateOneRequiredWithoutProductIntentNestedInputSchema).optional()
}).strict();

export const ProductIntentUncheckedUpdateWithoutIntentInputSchema: z.ZodType<Prisma.ProductIntentUncheckedUpdateWithoutIntentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  trackId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductIntentUncheckedUpdateManyWithoutIntentInputSchema: z.ZodType<Prisma.ProductIntentUncheckedUpdateManyWithoutIntentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  trackId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AssessmentCreateManyPatientInputSchema: z.ZodType<Prisma.AssessmentCreateManyPatientInput> = z.object({
  id: z.string().optional(),
  doctorId: z.string(),
  patientVisitId: z.string(),
  complaint: z.string(),
  currentMedication: z.string(),
  pastMedicalHistory: z.string(),
  examination: z.string(),
  investigation: z.string(),
  procedureDone: z.string(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  treatmentGiven: z.string(),
  followUp: z.coerce.date(),
  followupInstruction: z.string(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PatientVisitCreateManyPatientInputSchema: z.ZodType<Prisma.PatientVisitCreateManyPatientInput> = z.object({
  id: z.string().optional(),
  hospitalId: z.number().int(),
  departmentId: z.number().int(),
  doctorId: z.string(),
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date(),
  isDeleted: z.boolean().optional(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AssessmentUpdateWithoutPatientInputSchema: z.ZodType<Prisma.AssessmentUpdateWithoutPatientInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  complaint: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currentMedication: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pastMedicalHistory: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  examination: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investigation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  procedureDone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  treatmentGiven: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  followUp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  followupInstruction: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Doctor: z.lazy(() => UserUpdateOneRequiredWithoutAssessmentNestedInputSchema).optional(),
  PatientVisit: z.lazy(() => PatientVisitUpdateOneRequiredWithoutAssessmentNestedInputSchema).optional()
}).strict();

export const AssessmentUncheckedUpdateWithoutPatientInputSchema: z.ZodType<Prisma.AssessmentUncheckedUpdateWithoutPatientInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  doctorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  patientVisitId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  complaint: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currentMedication: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pastMedicalHistory: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  examination: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investigation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  procedureDone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  treatmentGiven: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  followUp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  followupInstruction: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AssessmentUncheckedUpdateManyWithoutPatientInputSchema: z.ZodType<Prisma.AssessmentUncheckedUpdateManyWithoutPatientInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  doctorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  patientVisitId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  complaint: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  currentMedication: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pastMedicalHistory: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  examination: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  investigation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  procedureDone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  diagnosis: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  treatmentGiven: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  followUp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  followupInstruction: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PatientVisitUpdateWithoutPatientInputSchema: z.ZodType<Prisma.PatientVisitUpdateWithoutPatientInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  checkInTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  checkOutTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUpdateOneWithoutPatientVisitNestedInputSchema).optional(),
  Department: z.lazy(() => DepartmentUpdateOneRequiredWithoutPatientVisitNestedInputSchema).optional(),
  Doctor: z.lazy(() => UserUpdateOneRequiredWithoutPatientVisitNestedInputSchema).optional(),
  Hospital: z.lazy(() => HospitalUpdateOneRequiredWithoutPatientVisitNestedInputSchema).optional()
}).strict();

export const PatientVisitUncheckedUpdateWithoutPatientInputSchema: z.ZodType<Prisma.PatientVisitUncheckedUpdateWithoutPatientInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  departmentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  doctorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  checkInTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  checkOutTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Assessment: z.lazy(() => AssessmentUncheckedUpdateOneWithoutPatientVisitNestedInputSchema).optional()
}).strict();

export const PatientVisitUncheckedUpdateManyWithoutPatientInputSchema: z.ZodType<Prisma.PatientVisitUncheckedUpdateManyWithoutPatientInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hospitalId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  departmentId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  doctorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  checkInTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  checkOutTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const HospitalFindFirstArgsSchema: z.ZodType<Prisma.HospitalFindFirstArgs> = z.object({
  select: HospitalSelectSchema.optional(),
  include: HospitalIncludeSchema.optional(),
  where: HospitalWhereInputSchema.optional(),
  orderBy: z.union([ HospitalOrderByWithRelationInputSchema.array(),HospitalOrderByWithRelationInputSchema ]).optional(),
  cursor: HospitalWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ HospitalScalarFieldEnumSchema,HospitalScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const HospitalFindFirstOrThrowArgsSchema: z.ZodType<Prisma.HospitalFindFirstOrThrowArgs> = z.object({
  select: HospitalSelectSchema.optional(),
  include: HospitalIncludeSchema.optional(),
  where: HospitalWhereInputSchema.optional(),
  orderBy: z.union([ HospitalOrderByWithRelationInputSchema.array(),HospitalOrderByWithRelationInputSchema ]).optional(),
  cursor: HospitalWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ HospitalScalarFieldEnumSchema,HospitalScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const HospitalFindManyArgsSchema: z.ZodType<Prisma.HospitalFindManyArgs> = z.object({
  select: HospitalSelectSchema.optional(),
  include: HospitalIncludeSchema.optional(),
  where: HospitalWhereInputSchema.optional(),
  orderBy: z.union([ HospitalOrderByWithRelationInputSchema.array(),HospitalOrderByWithRelationInputSchema ]).optional(),
  cursor: HospitalWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ HospitalScalarFieldEnumSchema,HospitalScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const HospitalAggregateArgsSchema: z.ZodType<Prisma.HospitalAggregateArgs> = z.object({
  where: HospitalWhereInputSchema.optional(),
  orderBy: z.union([ HospitalOrderByWithRelationInputSchema.array(),HospitalOrderByWithRelationInputSchema ]).optional(),
  cursor: HospitalWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const HospitalGroupByArgsSchema: z.ZodType<Prisma.HospitalGroupByArgs> = z.object({
  where: HospitalWhereInputSchema.optional(),
  orderBy: z.union([ HospitalOrderByWithAggregationInputSchema.array(),HospitalOrderByWithAggregationInputSchema ]).optional(),
  by: HospitalScalarFieldEnumSchema.array(),
  having: HospitalScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const HospitalFindUniqueArgsSchema: z.ZodType<Prisma.HospitalFindUniqueArgs> = z.object({
  select: HospitalSelectSchema.optional(),
  include: HospitalIncludeSchema.optional(),
  where: HospitalWhereUniqueInputSchema,
}).strict() ;

export const HospitalFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.HospitalFindUniqueOrThrowArgs> = z.object({
  select: HospitalSelectSchema.optional(),
  include: HospitalIncludeSchema.optional(),
  where: HospitalWhereUniqueInputSchema,
}).strict() ;

export const DepartmentFindFirstArgsSchema: z.ZodType<Prisma.DepartmentFindFirstArgs> = z.object({
  select: DepartmentSelectSchema.optional(),
  include: DepartmentIncludeSchema.optional(),
  where: DepartmentWhereInputSchema.optional(),
  orderBy: z.union([ DepartmentOrderByWithRelationInputSchema.array(),DepartmentOrderByWithRelationInputSchema ]).optional(),
  cursor: DepartmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DepartmentScalarFieldEnumSchema,DepartmentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DepartmentFindFirstOrThrowArgsSchema: z.ZodType<Prisma.DepartmentFindFirstOrThrowArgs> = z.object({
  select: DepartmentSelectSchema.optional(),
  include: DepartmentIncludeSchema.optional(),
  where: DepartmentWhereInputSchema.optional(),
  orderBy: z.union([ DepartmentOrderByWithRelationInputSchema.array(),DepartmentOrderByWithRelationInputSchema ]).optional(),
  cursor: DepartmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DepartmentScalarFieldEnumSchema,DepartmentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DepartmentFindManyArgsSchema: z.ZodType<Prisma.DepartmentFindManyArgs> = z.object({
  select: DepartmentSelectSchema.optional(),
  include: DepartmentIncludeSchema.optional(),
  where: DepartmentWhereInputSchema.optional(),
  orderBy: z.union([ DepartmentOrderByWithRelationInputSchema.array(),DepartmentOrderByWithRelationInputSchema ]).optional(),
  cursor: DepartmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DepartmentScalarFieldEnumSchema,DepartmentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DepartmentAggregateArgsSchema: z.ZodType<Prisma.DepartmentAggregateArgs> = z.object({
  where: DepartmentWhereInputSchema.optional(),
  orderBy: z.union([ DepartmentOrderByWithRelationInputSchema.array(),DepartmentOrderByWithRelationInputSchema ]).optional(),
  cursor: DepartmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DepartmentGroupByArgsSchema: z.ZodType<Prisma.DepartmentGroupByArgs> = z.object({
  where: DepartmentWhereInputSchema.optional(),
  orderBy: z.union([ DepartmentOrderByWithAggregationInputSchema.array(),DepartmentOrderByWithAggregationInputSchema ]).optional(),
  by: DepartmentScalarFieldEnumSchema.array(),
  having: DepartmentScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DepartmentFindUniqueArgsSchema: z.ZodType<Prisma.DepartmentFindUniqueArgs> = z.object({
  select: DepartmentSelectSchema.optional(),
  include: DepartmentIncludeSchema.optional(),
  where: DepartmentWhereUniqueInputSchema,
}).strict() ;

export const DepartmentFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.DepartmentFindUniqueOrThrowArgs> = z.object({
  select: DepartmentSelectSchema.optional(),
  include: DepartmentIncludeSchema.optional(),
  where: DepartmentWhereUniqueInputSchema,
}).strict() ;

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserLoginFindFirstArgsSchema: z.ZodType<Prisma.UserLoginFindFirstArgs> = z.object({
  select: UserLoginSelectSchema.optional(),
  include: UserLoginIncludeSchema.optional(),
  where: UserLoginWhereInputSchema.optional(),
  orderBy: z.union([ UserLoginOrderByWithRelationInputSchema.array(),UserLoginOrderByWithRelationInputSchema ]).optional(),
  cursor: UserLoginWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserLoginScalarFieldEnumSchema,UserLoginScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserLoginFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserLoginFindFirstOrThrowArgs> = z.object({
  select: UserLoginSelectSchema.optional(),
  include: UserLoginIncludeSchema.optional(),
  where: UserLoginWhereInputSchema.optional(),
  orderBy: z.union([ UserLoginOrderByWithRelationInputSchema.array(),UserLoginOrderByWithRelationInputSchema ]).optional(),
  cursor: UserLoginWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserLoginScalarFieldEnumSchema,UserLoginScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserLoginFindManyArgsSchema: z.ZodType<Prisma.UserLoginFindManyArgs> = z.object({
  select: UserLoginSelectSchema.optional(),
  include: UserLoginIncludeSchema.optional(),
  where: UserLoginWhereInputSchema.optional(),
  orderBy: z.union([ UserLoginOrderByWithRelationInputSchema.array(),UserLoginOrderByWithRelationInputSchema ]).optional(),
  cursor: UserLoginWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserLoginScalarFieldEnumSchema,UserLoginScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserLoginAggregateArgsSchema: z.ZodType<Prisma.UserLoginAggregateArgs> = z.object({
  where: UserLoginWhereInputSchema.optional(),
  orderBy: z.union([ UserLoginOrderByWithRelationInputSchema.array(),UserLoginOrderByWithRelationInputSchema ]).optional(),
  cursor: UserLoginWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserLoginGroupByArgsSchema: z.ZodType<Prisma.UserLoginGroupByArgs> = z.object({
  where: UserLoginWhereInputSchema.optional(),
  orderBy: z.union([ UserLoginOrderByWithAggregationInputSchema.array(),UserLoginOrderByWithAggregationInputSchema ]).optional(),
  by: UserLoginScalarFieldEnumSchema.array(),
  having: UserLoginScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserLoginFindUniqueArgsSchema: z.ZodType<Prisma.UserLoginFindUniqueArgs> = z.object({
  select: UserLoginSelectSchema.optional(),
  include: UserLoginIncludeSchema.optional(),
  where: UserLoginWhereUniqueInputSchema,
}).strict() ;

export const UserLoginFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserLoginFindUniqueOrThrowArgs> = z.object({
  select: UserLoginSelectSchema.optional(),
  include: UserLoginIncludeSchema.optional(),
  where: UserLoginWhereUniqueInputSchema,
}).strict() ;

export const RoleFindFirstArgsSchema: z.ZodType<Prisma.RoleFindFirstArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereInputSchema.optional(),
  orderBy: z.union([ RoleOrderByWithRelationInputSchema.array(),RoleOrderByWithRelationInputSchema ]).optional(),
  cursor: RoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoleScalarFieldEnumSchema,RoleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RoleFindFirstOrThrowArgsSchema: z.ZodType<Prisma.RoleFindFirstOrThrowArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereInputSchema.optional(),
  orderBy: z.union([ RoleOrderByWithRelationInputSchema.array(),RoleOrderByWithRelationInputSchema ]).optional(),
  cursor: RoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoleScalarFieldEnumSchema,RoleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RoleFindManyArgsSchema: z.ZodType<Prisma.RoleFindManyArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereInputSchema.optional(),
  orderBy: z.union([ RoleOrderByWithRelationInputSchema.array(),RoleOrderByWithRelationInputSchema ]).optional(),
  cursor: RoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoleScalarFieldEnumSchema,RoleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RoleAggregateArgsSchema: z.ZodType<Prisma.RoleAggregateArgs> = z.object({
  where: RoleWhereInputSchema.optional(),
  orderBy: z.union([ RoleOrderByWithRelationInputSchema.array(),RoleOrderByWithRelationInputSchema ]).optional(),
  cursor: RoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RoleGroupByArgsSchema: z.ZodType<Prisma.RoleGroupByArgs> = z.object({
  where: RoleWhereInputSchema.optional(),
  orderBy: z.union([ RoleOrderByWithAggregationInputSchema.array(),RoleOrderByWithAggregationInputSchema ]).optional(),
  by: RoleScalarFieldEnumSchema.array(),
  having: RoleScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RoleFindUniqueArgsSchema: z.ZodType<Prisma.RoleFindUniqueArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereUniqueInputSchema,
}).strict() ;

export const RoleFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.RoleFindUniqueOrThrowArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereUniqueInputSchema,
}).strict() ;

export const UserRoleFindFirstArgsSchema: z.ZodType<Prisma.UserRoleFindFirstArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  include: UserRoleIncludeSchema.optional(),
  where: UserRoleWhereInputSchema.optional(),
  orderBy: z.union([ UserRoleOrderByWithRelationInputSchema.array(),UserRoleOrderByWithRelationInputSchema ]).optional(),
  cursor: UserRoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserRoleScalarFieldEnumSchema,UserRoleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserRoleFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserRoleFindFirstOrThrowArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  include: UserRoleIncludeSchema.optional(),
  where: UserRoleWhereInputSchema.optional(),
  orderBy: z.union([ UserRoleOrderByWithRelationInputSchema.array(),UserRoleOrderByWithRelationInputSchema ]).optional(),
  cursor: UserRoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserRoleScalarFieldEnumSchema,UserRoleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserRoleFindManyArgsSchema: z.ZodType<Prisma.UserRoleFindManyArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  include: UserRoleIncludeSchema.optional(),
  where: UserRoleWhereInputSchema.optional(),
  orderBy: z.union([ UserRoleOrderByWithRelationInputSchema.array(),UserRoleOrderByWithRelationInputSchema ]).optional(),
  cursor: UserRoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserRoleScalarFieldEnumSchema,UserRoleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserRoleAggregateArgsSchema: z.ZodType<Prisma.UserRoleAggregateArgs> = z.object({
  where: UserRoleWhereInputSchema.optional(),
  orderBy: z.union([ UserRoleOrderByWithRelationInputSchema.array(),UserRoleOrderByWithRelationInputSchema ]).optional(),
  cursor: UserRoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserRoleGroupByArgsSchema: z.ZodType<Prisma.UserRoleGroupByArgs> = z.object({
  where: UserRoleWhereInputSchema.optional(),
  orderBy: z.union([ UserRoleOrderByWithAggregationInputSchema.array(),UserRoleOrderByWithAggregationInputSchema ]).optional(),
  by: UserRoleScalarFieldEnumSchema.array(),
  having: UserRoleScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserRoleFindUniqueArgsSchema: z.ZodType<Prisma.UserRoleFindUniqueArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  include: UserRoleIncludeSchema.optional(),
  where: UserRoleWhereUniqueInputSchema,
}).strict() ;

export const UserRoleFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserRoleFindUniqueOrThrowArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  include: UserRoleIncludeSchema.optional(),
  where: UserRoleWhereUniqueInputSchema,
}).strict() ;

export const PermissionFindFirstArgsSchema: z.ZodType<Prisma.PermissionFindFirstArgs> = z.object({
  select: PermissionSelectSchema.optional(),
  include: PermissionIncludeSchema.optional(),
  where: PermissionWhereInputSchema.optional(),
  orderBy: z.union([ PermissionOrderByWithRelationInputSchema.array(),PermissionOrderByWithRelationInputSchema ]).optional(),
  cursor: PermissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PermissionScalarFieldEnumSchema,PermissionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PermissionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PermissionFindFirstOrThrowArgs> = z.object({
  select: PermissionSelectSchema.optional(),
  include: PermissionIncludeSchema.optional(),
  where: PermissionWhereInputSchema.optional(),
  orderBy: z.union([ PermissionOrderByWithRelationInputSchema.array(),PermissionOrderByWithRelationInputSchema ]).optional(),
  cursor: PermissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PermissionScalarFieldEnumSchema,PermissionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PermissionFindManyArgsSchema: z.ZodType<Prisma.PermissionFindManyArgs> = z.object({
  select: PermissionSelectSchema.optional(),
  include: PermissionIncludeSchema.optional(),
  where: PermissionWhereInputSchema.optional(),
  orderBy: z.union([ PermissionOrderByWithRelationInputSchema.array(),PermissionOrderByWithRelationInputSchema ]).optional(),
  cursor: PermissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PermissionScalarFieldEnumSchema,PermissionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PermissionAggregateArgsSchema: z.ZodType<Prisma.PermissionAggregateArgs> = z.object({
  where: PermissionWhereInputSchema.optional(),
  orderBy: z.union([ PermissionOrderByWithRelationInputSchema.array(),PermissionOrderByWithRelationInputSchema ]).optional(),
  cursor: PermissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PermissionGroupByArgsSchema: z.ZodType<Prisma.PermissionGroupByArgs> = z.object({
  where: PermissionWhereInputSchema.optional(),
  orderBy: z.union([ PermissionOrderByWithAggregationInputSchema.array(),PermissionOrderByWithAggregationInputSchema ]).optional(),
  by: PermissionScalarFieldEnumSchema.array(),
  having: PermissionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PermissionFindUniqueArgsSchema: z.ZodType<Prisma.PermissionFindUniqueArgs> = z.object({
  select: PermissionSelectSchema.optional(),
  include: PermissionIncludeSchema.optional(),
  where: PermissionWhereUniqueInputSchema,
}).strict() ;

export const PermissionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PermissionFindUniqueOrThrowArgs> = z.object({
  select: PermissionSelectSchema.optional(),
  include: PermissionIncludeSchema.optional(),
  where: PermissionWhereUniqueInputSchema,
}).strict() ;

export const RolePermissionFindFirstArgsSchema: z.ZodType<Prisma.RolePermissionFindFirstArgs> = z.object({
  select: RolePermissionSelectSchema.optional(),
  include: RolePermissionIncludeSchema.optional(),
  where: RolePermissionWhereInputSchema.optional(),
  orderBy: z.union([ RolePermissionOrderByWithRelationInputSchema.array(),RolePermissionOrderByWithRelationInputSchema ]).optional(),
  cursor: RolePermissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RolePermissionScalarFieldEnumSchema,RolePermissionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RolePermissionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.RolePermissionFindFirstOrThrowArgs> = z.object({
  select: RolePermissionSelectSchema.optional(),
  include: RolePermissionIncludeSchema.optional(),
  where: RolePermissionWhereInputSchema.optional(),
  orderBy: z.union([ RolePermissionOrderByWithRelationInputSchema.array(),RolePermissionOrderByWithRelationInputSchema ]).optional(),
  cursor: RolePermissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RolePermissionScalarFieldEnumSchema,RolePermissionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RolePermissionFindManyArgsSchema: z.ZodType<Prisma.RolePermissionFindManyArgs> = z.object({
  select: RolePermissionSelectSchema.optional(),
  include: RolePermissionIncludeSchema.optional(),
  where: RolePermissionWhereInputSchema.optional(),
  orderBy: z.union([ RolePermissionOrderByWithRelationInputSchema.array(),RolePermissionOrderByWithRelationInputSchema ]).optional(),
  cursor: RolePermissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RolePermissionScalarFieldEnumSchema,RolePermissionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RolePermissionAggregateArgsSchema: z.ZodType<Prisma.RolePermissionAggregateArgs> = z.object({
  where: RolePermissionWhereInputSchema.optional(),
  orderBy: z.union([ RolePermissionOrderByWithRelationInputSchema.array(),RolePermissionOrderByWithRelationInputSchema ]).optional(),
  cursor: RolePermissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RolePermissionGroupByArgsSchema: z.ZodType<Prisma.RolePermissionGroupByArgs> = z.object({
  where: RolePermissionWhereInputSchema.optional(),
  orderBy: z.union([ RolePermissionOrderByWithAggregationInputSchema.array(),RolePermissionOrderByWithAggregationInputSchema ]).optional(),
  by: RolePermissionScalarFieldEnumSchema.array(),
  having: RolePermissionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RolePermissionFindUniqueArgsSchema: z.ZodType<Prisma.RolePermissionFindUniqueArgs> = z.object({
  select: RolePermissionSelectSchema.optional(),
  include: RolePermissionIncludeSchema.optional(),
  where: RolePermissionWhereUniqueInputSchema,
}).strict() ;

export const RolePermissionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.RolePermissionFindUniqueOrThrowArgs> = z.object({
  select: RolePermissionSelectSchema.optional(),
  include: RolePermissionIncludeSchema.optional(),
  where: RolePermissionWhereUniqueInputSchema,
}).strict() ;

export const VendorFindFirstArgsSchema: z.ZodType<Prisma.VendorFindFirstArgs> = z.object({
  select: VendorSelectSchema.optional(),
  include: VendorIncludeSchema.optional(),
  where: VendorWhereInputSchema.optional(),
  orderBy: z.union([ VendorOrderByWithRelationInputSchema.array(),VendorOrderByWithRelationInputSchema ]).optional(),
  cursor: VendorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VendorScalarFieldEnumSchema,VendorScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VendorFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VendorFindFirstOrThrowArgs> = z.object({
  select: VendorSelectSchema.optional(),
  include: VendorIncludeSchema.optional(),
  where: VendorWhereInputSchema.optional(),
  orderBy: z.union([ VendorOrderByWithRelationInputSchema.array(),VendorOrderByWithRelationInputSchema ]).optional(),
  cursor: VendorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VendorScalarFieldEnumSchema,VendorScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VendorFindManyArgsSchema: z.ZodType<Prisma.VendorFindManyArgs> = z.object({
  select: VendorSelectSchema.optional(),
  include: VendorIncludeSchema.optional(),
  where: VendorWhereInputSchema.optional(),
  orderBy: z.union([ VendorOrderByWithRelationInputSchema.array(),VendorOrderByWithRelationInputSchema ]).optional(),
  cursor: VendorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VendorScalarFieldEnumSchema,VendorScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VendorAggregateArgsSchema: z.ZodType<Prisma.VendorAggregateArgs> = z.object({
  where: VendorWhereInputSchema.optional(),
  orderBy: z.union([ VendorOrderByWithRelationInputSchema.array(),VendorOrderByWithRelationInputSchema ]).optional(),
  cursor: VendorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const VendorGroupByArgsSchema: z.ZodType<Prisma.VendorGroupByArgs> = z.object({
  where: VendorWhereInputSchema.optional(),
  orderBy: z.union([ VendorOrderByWithAggregationInputSchema.array(),VendorOrderByWithAggregationInputSchema ]).optional(),
  by: VendorScalarFieldEnumSchema.array(),
  having: VendorScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const VendorFindUniqueArgsSchema: z.ZodType<Prisma.VendorFindUniqueArgs> = z.object({
  select: VendorSelectSchema.optional(),
  include: VendorIncludeSchema.optional(),
  where: VendorWhereUniqueInputSchema,
}).strict() ;

export const VendorFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VendorFindUniqueOrThrowArgs> = z.object({
  select: VendorSelectSchema.optional(),
  include: VendorIncludeSchema.optional(),
  where: VendorWhereUniqueInputSchema,
}).strict() ;

export const ProductFindFirstArgsSchema: z.ZodType<Prisma.ProductFindFirstArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(),ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema,ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProductFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProductFindFirstOrThrowArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(),ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema,ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProductFindManyArgsSchema: z.ZodType<Prisma.ProductFindManyArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(),ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema,ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProductAggregateArgsSchema: z.ZodType<Prisma.ProductAggregateArgs> = z.object({
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(),ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProductGroupByArgsSchema: z.ZodType<Prisma.ProductGroupByArgs> = z.object({
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithAggregationInputSchema.array(),ProductOrderByWithAggregationInputSchema ]).optional(),
  by: ProductScalarFieldEnumSchema.array(),
  having: ProductScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProductFindUniqueArgsSchema: z.ZodType<Prisma.ProductFindUniqueArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema,
}).strict() ;

export const ProductFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProductFindUniqueOrThrowArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema,
}).strict() ;

export const ProductDepartmentFindFirstArgsSchema: z.ZodType<Prisma.ProductDepartmentFindFirstArgs> = z.object({
  select: ProductDepartmentSelectSchema.optional(),
  include: ProductDepartmentIncludeSchema.optional(),
  where: ProductDepartmentWhereInputSchema.optional(),
  orderBy: z.union([ ProductDepartmentOrderByWithRelationInputSchema.array(),ProductDepartmentOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductDepartmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductDepartmentScalarFieldEnumSchema,ProductDepartmentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProductDepartmentFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProductDepartmentFindFirstOrThrowArgs> = z.object({
  select: ProductDepartmentSelectSchema.optional(),
  include: ProductDepartmentIncludeSchema.optional(),
  where: ProductDepartmentWhereInputSchema.optional(),
  orderBy: z.union([ ProductDepartmentOrderByWithRelationInputSchema.array(),ProductDepartmentOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductDepartmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductDepartmentScalarFieldEnumSchema,ProductDepartmentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProductDepartmentFindManyArgsSchema: z.ZodType<Prisma.ProductDepartmentFindManyArgs> = z.object({
  select: ProductDepartmentSelectSchema.optional(),
  include: ProductDepartmentIncludeSchema.optional(),
  where: ProductDepartmentWhereInputSchema.optional(),
  orderBy: z.union([ ProductDepartmentOrderByWithRelationInputSchema.array(),ProductDepartmentOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductDepartmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductDepartmentScalarFieldEnumSchema,ProductDepartmentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProductDepartmentAggregateArgsSchema: z.ZodType<Prisma.ProductDepartmentAggregateArgs> = z.object({
  where: ProductDepartmentWhereInputSchema.optional(),
  orderBy: z.union([ ProductDepartmentOrderByWithRelationInputSchema.array(),ProductDepartmentOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductDepartmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProductDepartmentGroupByArgsSchema: z.ZodType<Prisma.ProductDepartmentGroupByArgs> = z.object({
  where: ProductDepartmentWhereInputSchema.optional(),
  orderBy: z.union([ ProductDepartmentOrderByWithAggregationInputSchema.array(),ProductDepartmentOrderByWithAggregationInputSchema ]).optional(),
  by: ProductDepartmentScalarFieldEnumSchema.array(),
  having: ProductDepartmentScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProductDepartmentFindUniqueArgsSchema: z.ZodType<Prisma.ProductDepartmentFindUniqueArgs> = z.object({
  select: ProductDepartmentSelectSchema.optional(),
  include: ProductDepartmentIncludeSchema.optional(),
  where: ProductDepartmentWhereUniqueInputSchema,
}).strict() ;

export const ProductDepartmentFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProductDepartmentFindUniqueOrThrowArgs> = z.object({
  select: ProductDepartmentSelectSchema.optional(),
  include: ProductDepartmentIncludeSchema.optional(),
  where: ProductDepartmentWhereUniqueInputSchema,
}).strict() ;

export const IntentTrackFindFirstArgsSchema: z.ZodType<Prisma.IntentTrackFindFirstArgs> = z.object({
  select: IntentTrackSelectSchema.optional(),
  include: IntentTrackIncludeSchema.optional(),
  where: IntentTrackWhereInputSchema.optional(),
  orderBy: z.union([ IntentTrackOrderByWithRelationInputSchema.array(),IntentTrackOrderByWithRelationInputSchema ]).optional(),
  cursor: IntentTrackWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ IntentTrackScalarFieldEnumSchema,IntentTrackScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const IntentTrackFindFirstOrThrowArgsSchema: z.ZodType<Prisma.IntentTrackFindFirstOrThrowArgs> = z.object({
  select: IntentTrackSelectSchema.optional(),
  include: IntentTrackIncludeSchema.optional(),
  where: IntentTrackWhereInputSchema.optional(),
  orderBy: z.union([ IntentTrackOrderByWithRelationInputSchema.array(),IntentTrackOrderByWithRelationInputSchema ]).optional(),
  cursor: IntentTrackWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ IntentTrackScalarFieldEnumSchema,IntentTrackScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const IntentTrackFindManyArgsSchema: z.ZodType<Prisma.IntentTrackFindManyArgs> = z.object({
  select: IntentTrackSelectSchema.optional(),
  include: IntentTrackIncludeSchema.optional(),
  where: IntentTrackWhereInputSchema.optional(),
  orderBy: z.union([ IntentTrackOrderByWithRelationInputSchema.array(),IntentTrackOrderByWithRelationInputSchema ]).optional(),
  cursor: IntentTrackWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ IntentTrackScalarFieldEnumSchema,IntentTrackScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const IntentTrackAggregateArgsSchema: z.ZodType<Prisma.IntentTrackAggregateArgs> = z.object({
  where: IntentTrackWhereInputSchema.optional(),
  orderBy: z.union([ IntentTrackOrderByWithRelationInputSchema.array(),IntentTrackOrderByWithRelationInputSchema ]).optional(),
  cursor: IntentTrackWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const IntentTrackGroupByArgsSchema: z.ZodType<Prisma.IntentTrackGroupByArgs> = z.object({
  where: IntentTrackWhereInputSchema.optional(),
  orderBy: z.union([ IntentTrackOrderByWithAggregationInputSchema.array(),IntentTrackOrderByWithAggregationInputSchema ]).optional(),
  by: IntentTrackScalarFieldEnumSchema.array(),
  having: IntentTrackScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const IntentTrackFindUniqueArgsSchema: z.ZodType<Prisma.IntentTrackFindUniqueArgs> = z.object({
  select: IntentTrackSelectSchema.optional(),
  include: IntentTrackIncludeSchema.optional(),
  where: IntentTrackWhereUniqueInputSchema,
}).strict() ;

export const IntentTrackFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.IntentTrackFindUniqueOrThrowArgs> = z.object({
  select: IntentTrackSelectSchema.optional(),
  include: IntentTrackIncludeSchema.optional(),
  where: IntentTrackWhereUniqueInputSchema,
}).strict() ;

export const IntentStatusFindFirstArgsSchema: z.ZodType<Prisma.IntentStatusFindFirstArgs> = z.object({
  select: IntentStatusSelectSchema.optional(),
  include: IntentStatusIncludeSchema.optional(),
  where: IntentStatusWhereInputSchema.optional(),
  orderBy: z.union([ IntentStatusOrderByWithRelationInputSchema.array(),IntentStatusOrderByWithRelationInputSchema ]).optional(),
  cursor: IntentStatusWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ IntentStatusScalarFieldEnumSchema,IntentStatusScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const IntentStatusFindFirstOrThrowArgsSchema: z.ZodType<Prisma.IntentStatusFindFirstOrThrowArgs> = z.object({
  select: IntentStatusSelectSchema.optional(),
  include: IntentStatusIncludeSchema.optional(),
  where: IntentStatusWhereInputSchema.optional(),
  orderBy: z.union([ IntentStatusOrderByWithRelationInputSchema.array(),IntentStatusOrderByWithRelationInputSchema ]).optional(),
  cursor: IntentStatusWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ IntentStatusScalarFieldEnumSchema,IntentStatusScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const IntentStatusFindManyArgsSchema: z.ZodType<Prisma.IntentStatusFindManyArgs> = z.object({
  select: IntentStatusSelectSchema.optional(),
  include: IntentStatusIncludeSchema.optional(),
  where: IntentStatusWhereInputSchema.optional(),
  orderBy: z.union([ IntentStatusOrderByWithRelationInputSchema.array(),IntentStatusOrderByWithRelationInputSchema ]).optional(),
  cursor: IntentStatusWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ IntentStatusScalarFieldEnumSchema,IntentStatusScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const IntentStatusAggregateArgsSchema: z.ZodType<Prisma.IntentStatusAggregateArgs> = z.object({
  where: IntentStatusWhereInputSchema.optional(),
  orderBy: z.union([ IntentStatusOrderByWithRelationInputSchema.array(),IntentStatusOrderByWithRelationInputSchema ]).optional(),
  cursor: IntentStatusWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const IntentStatusGroupByArgsSchema: z.ZodType<Prisma.IntentStatusGroupByArgs> = z.object({
  where: IntentStatusWhereInputSchema.optional(),
  orderBy: z.union([ IntentStatusOrderByWithAggregationInputSchema.array(),IntentStatusOrderByWithAggregationInputSchema ]).optional(),
  by: IntentStatusScalarFieldEnumSchema.array(),
  having: IntentStatusScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const IntentStatusFindUniqueArgsSchema: z.ZodType<Prisma.IntentStatusFindUniqueArgs> = z.object({
  select: IntentStatusSelectSchema.optional(),
  include: IntentStatusIncludeSchema.optional(),
  where: IntentStatusWhereUniqueInputSchema,
}).strict() ;

export const IntentStatusFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.IntentStatusFindUniqueOrThrowArgs> = z.object({
  select: IntentStatusSelectSchema.optional(),
  include: IntentStatusIncludeSchema.optional(),
  where: IntentStatusWhereUniqueInputSchema,
}).strict() ;

export const ProductIntentFindFirstArgsSchema: z.ZodType<Prisma.ProductIntentFindFirstArgs> = z.object({
  select: ProductIntentSelectSchema.optional(),
  include: ProductIntentIncludeSchema.optional(),
  where: ProductIntentWhereInputSchema.optional(),
  orderBy: z.union([ ProductIntentOrderByWithRelationInputSchema.array(),ProductIntentOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductIntentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductIntentScalarFieldEnumSchema,ProductIntentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProductIntentFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProductIntentFindFirstOrThrowArgs> = z.object({
  select: ProductIntentSelectSchema.optional(),
  include: ProductIntentIncludeSchema.optional(),
  where: ProductIntentWhereInputSchema.optional(),
  orderBy: z.union([ ProductIntentOrderByWithRelationInputSchema.array(),ProductIntentOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductIntentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductIntentScalarFieldEnumSchema,ProductIntentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProductIntentFindManyArgsSchema: z.ZodType<Prisma.ProductIntentFindManyArgs> = z.object({
  select: ProductIntentSelectSchema.optional(),
  include: ProductIntentIncludeSchema.optional(),
  where: ProductIntentWhereInputSchema.optional(),
  orderBy: z.union([ ProductIntentOrderByWithRelationInputSchema.array(),ProductIntentOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductIntentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductIntentScalarFieldEnumSchema,ProductIntentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProductIntentAggregateArgsSchema: z.ZodType<Prisma.ProductIntentAggregateArgs> = z.object({
  where: ProductIntentWhereInputSchema.optional(),
  orderBy: z.union([ ProductIntentOrderByWithRelationInputSchema.array(),ProductIntentOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductIntentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProductIntentGroupByArgsSchema: z.ZodType<Prisma.ProductIntentGroupByArgs> = z.object({
  where: ProductIntentWhereInputSchema.optional(),
  orderBy: z.union([ ProductIntentOrderByWithAggregationInputSchema.array(),ProductIntentOrderByWithAggregationInputSchema ]).optional(),
  by: ProductIntentScalarFieldEnumSchema.array(),
  having: ProductIntentScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProductIntentFindUniqueArgsSchema: z.ZodType<Prisma.ProductIntentFindUniqueArgs> = z.object({
  select: ProductIntentSelectSchema.optional(),
  include: ProductIntentIncludeSchema.optional(),
  where: ProductIntentWhereUniqueInputSchema,
}).strict() ;

export const ProductIntentFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProductIntentFindUniqueOrThrowArgs> = z.object({
  select: ProductIntentSelectSchema.optional(),
  include: ProductIntentIncludeSchema.optional(),
  where: ProductIntentWhereUniqueInputSchema,
}).strict() ;

export const PatientFindFirstArgsSchema: z.ZodType<Prisma.PatientFindFirstArgs> = z.object({
  select: PatientSelectSchema.optional(),
  include: PatientIncludeSchema.optional(),
  where: PatientWhereInputSchema.optional(),
  orderBy: z.union([ PatientOrderByWithRelationInputSchema.array(),PatientOrderByWithRelationInputSchema ]).optional(),
  cursor: PatientWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PatientScalarFieldEnumSchema,PatientScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PatientFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PatientFindFirstOrThrowArgs> = z.object({
  select: PatientSelectSchema.optional(),
  include: PatientIncludeSchema.optional(),
  where: PatientWhereInputSchema.optional(),
  orderBy: z.union([ PatientOrderByWithRelationInputSchema.array(),PatientOrderByWithRelationInputSchema ]).optional(),
  cursor: PatientWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PatientScalarFieldEnumSchema,PatientScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PatientFindManyArgsSchema: z.ZodType<Prisma.PatientFindManyArgs> = z.object({
  select: PatientSelectSchema.optional(),
  include: PatientIncludeSchema.optional(),
  where: PatientWhereInputSchema.optional(),
  orderBy: z.union([ PatientOrderByWithRelationInputSchema.array(),PatientOrderByWithRelationInputSchema ]).optional(),
  cursor: PatientWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PatientScalarFieldEnumSchema,PatientScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PatientAggregateArgsSchema: z.ZodType<Prisma.PatientAggregateArgs> = z.object({
  where: PatientWhereInputSchema.optional(),
  orderBy: z.union([ PatientOrderByWithRelationInputSchema.array(),PatientOrderByWithRelationInputSchema ]).optional(),
  cursor: PatientWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PatientGroupByArgsSchema: z.ZodType<Prisma.PatientGroupByArgs> = z.object({
  where: PatientWhereInputSchema.optional(),
  orderBy: z.union([ PatientOrderByWithAggregationInputSchema.array(),PatientOrderByWithAggregationInputSchema ]).optional(),
  by: PatientScalarFieldEnumSchema.array(),
  having: PatientScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PatientFindUniqueArgsSchema: z.ZodType<Prisma.PatientFindUniqueArgs> = z.object({
  select: PatientSelectSchema.optional(),
  include: PatientIncludeSchema.optional(),
  where: PatientWhereUniqueInputSchema,
}).strict() ;

export const PatientFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PatientFindUniqueOrThrowArgs> = z.object({
  select: PatientSelectSchema.optional(),
  include: PatientIncludeSchema.optional(),
  where: PatientWhereUniqueInputSchema,
}).strict() ;

export const PatientVisitFindFirstArgsSchema: z.ZodType<Prisma.PatientVisitFindFirstArgs> = z.object({
  select: PatientVisitSelectSchema.optional(),
  include: PatientVisitIncludeSchema.optional(),
  where: PatientVisitWhereInputSchema.optional(),
  orderBy: z.union([ PatientVisitOrderByWithRelationInputSchema.array(),PatientVisitOrderByWithRelationInputSchema ]).optional(),
  cursor: PatientVisitWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PatientVisitScalarFieldEnumSchema,PatientVisitScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PatientVisitFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PatientVisitFindFirstOrThrowArgs> = z.object({
  select: PatientVisitSelectSchema.optional(),
  include: PatientVisitIncludeSchema.optional(),
  where: PatientVisitWhereInputSchema.optional(),
  orderBy: z.union([ PatientVisitOrderByWithRelationInputSchema.array(),PatientVisitOrderByWithRelationInputSchema ]).optional(),
  cursor: PatientVisitWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PatientVisitScalarFieldEnumSchema,PatientVisitScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PatientVisitFindManyArgsSchema: z.ZodType<Prisma.PatientVisitFindManyArgs> = z.object({
  select: PatientVisitSelectSchema.optional(),
  include: PatientVisitIncludeSchema.optional(),
  where: PatientVisitWhereInputSchema.optional(),
  orderBy: z.union([ PatientVisitOrderByWithRelationInputSchema.array(),PatientVisitOrderByWithRelationInputSchema ]).optional(),
  cursor: PatientVisitWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PatientVisitScalarFieldEnumSchema,PatientVisitScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PatientVisitAggregateArgsSchema: z.ZodType<Prisma.PatientVisitAggregateArgs> = z.object({
  where: PatientVisitWhereInputSchema.optional(),
  orderBy: z.union([ PatientVisitOrderByWithRelationInputSchema.array(),PatientVisitOrderByWithRelationInputSchema ]).optional(),
  cursor: PatientVisitWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PatientVisitGroupByArgsSchema: z.ZodType<Prisma.PatientVisitGroupByArgs> = z.object({
  where: PatientVisitWhereInputSchema.optional(),
  orderBy: z.union([ PatientVisitOrderByWithAggregationInputSchema.array(),PatientVisitOrderByWithAggregationInputSchema ]).optional(),
  by: PatientVisitScalarFieldEnumSchema.array(),
  having: PatientVisitScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PatientVisitFindUniqueArgsSchema: z.ZodType<Prisma.PatientVisitFindUniqueArgs> = z.object({
  select: PatientVisitSelectSchema.optional(),
  include: PatientVisitIncludeSchema.optional(),
  where: PatientVisitWhereUniqueInputSchema,
}).strict() ;

export const PatientVisitFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PatientVisitFindUniqueOrThrowArgs> = z.object({
  select: PatientVisitSelectSchema.optional(),
  include: PatientVisitIncludeSchema.optional(),
  where: PatientVisitWhereUniqueInputSchema,
}).strict() ;

export const AssessmentFindFirstArgsSchema: z.ZodType<Prisma.AssessmentFindFirstArgs> = z.object({
  select: AssessmentSelectSchema.optional(),
  include: AssessmentIncludeSchema.optional(),
  where: AssessmentWhereInputSchema.optional(),
  orderBy: z.union([ AssessmentOrderByWithRelationInputSchema.array(),AssessmentOrderByWithRelationInputSchema ]).optional(),
  cursor: AssessmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AssessmentScalarFieldEnumSchema,AssessmentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AssessmentFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AssessmentFindFirstOrThrowArgs> = z.object({
  select: AssessmentSelectSchema.optional(),
  include: AssessmentIncludeSchema.optional(),
  where: AssessmentWhereInputSchema.optional(),
  orderBy: z.union([ AssessmentOrderByWithRelationInputSchema.array(),AssessmentOrderByWithRelationInputSchema ]).optional(),
  cursor: AssessmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AssessmentScalarFieldEnumSchema,AssessmentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AssessmentFindManyArgsSchema: z.ZodType<Prisma.AssessmentFindManyArgs> = z.object({
  select: AssessmentSelectSchema.optional(),
  include: AssessmentIncludeSchema.optional(),
  where: AssessmentWhereInputSchema.optional(),
  orderBy: z.union([ AssessmentOrderByWithRelationInputSchema.array(),AssessmentOrderByWithRelationInputSchema ]).optional(),
  cursor: AssessmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AssessmentScalarFieldEnumSchema,AssessmentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AssessmentAggregateArgsSchema: z.ZodType<Prisma.AssessmentAggregateArgs> = z.object({
  where: AssessmentWhereInputSchema.optional(),
  orderBy: z.union([ AssessmentOrderByWithRelationInputSchema.array(),AssessmentOrderByWithRelationInputSchema ]).optional(),
  cursor: AssessmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AssessmentGroupByArgsSchema: z.ZodType<Prisma.AssessmentGroupByArgs> = z.object({
  where: AssessmentWhereInputSchema.optional(),
  orderBy: z.union([ AssessmentOrderByWithAggregationInputSchema.array(),AssessmentOrderByWithAggregationInputSchema ]).optional(),
  by: AssessmentScalarFieldEnumSchema.array(),
  having: AssessmentScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AssessmentFindUniqueArgsSchema: z.ZodType<Prisma.AssessmentFindUniqueArgs> = z.object({
  select: AssessmentSelectSchema.optional(),
  include: AssessmentIncludeSchema.optional(),
  where: AssessmentWhereUniqueInputSchema,
}).strict() ;

export const AssessmentFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AssessmentFindUniqueOrThrowArgs> = z.object({
  select: AssessmentSelectSchema.optional(),
  include: AssessmentIncludeSchema.optional(),
  where: AssessmentWhereUniqueInputSchema,
}).strict() ;

export const HospitalCreateArgsSchema: z.ZodType<Prisma.HospitalCreateArgs> = z.object({
  select: HospitalSelectSchema.optional(),
  include: HospitalIncludeSchema.optional(),
  data: z.union([ HospitalCreateInputSchema,HospitalUncheckedCreateInputSchema ]),
}).strict() ;

export const HospitalUpsertArgsSchema: z.ZodType<Prisma.HospitalUpsertArgs> = z.object({
  select: HospitalSelectSchema.optional(),
  include: HospitalIncludeSchema.optional(),
  where: HospitalWhereUniqueInputSchema,
  create: z.union([ HospitalCreateInputSchema,HospitalUncheckedCreateInputSchema ]),
  update: z.union([ HospitalUpdateInputSchema,HospitalUncheckedUpdateInputSchema ]),
}).strict() ;

export const HospitalCreateManyArgsSchema: z.ZodType<Prisma.HospitalCreateManyArgs> = z.object({
  data: z.union([ HospitalCreateManyInputSchema,HospitalCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const HospitalCreateManyAndReturnArgsSchema: z.ZodType<Prisma.HospitalCreateManyAndReturnArgs> = z.object({
  data: z.union([ HospitalCreateManyInputSchema,HospitalCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const HospitalDeleteArgsSchema: z.ZodType<Prisma.HospitalDeleteArgs> = z.object({
  select: HospitalSelectSchema.optional(),
  include: HospitalIncludeSchema.optional(),
  where: HospitalWhereUniqueInputSchema,
}).strict() ;

export const HospitalUpdateArgsSchema: z.ZodType<Prisma.HospitalUpdateArgs> = z.object({
  select: HospitalSelectSchema.optional(),
  include: HospitalIncludeSchema.optional(),
  data: z.union([ HospitalUpdateInputSchema,HospitalUncheckedUpdateInputSchema ]),
  where: HospitalWhereUniqueInputSchema,
}).strict() ;

export const HospitalUpdateManyArgsSchema: z.ZodType<Prisma.HospitalUpdateManyArgs> = z.object({
  data: z.union([ HospitalUpdateManyMutationInputSchema,HospitalUncheckedUpdateManyInputSchema ]),
  where: HospitalWhereInputSchema.optional(),
}).strict() ;

export const HospitalDeleteManyArgsSchema: z.ZodType<Prisma.HospitalDeleteManyArgs> = z.object({
  where: HospitalWhereInputSchema.optional(),
}).strict() ;

export const DepartmentCreateArgsSchema: z.ZodType<Prisma.DepartmentCreateArgs> = z.object({
  select: DepartmentSelectSchema.optional(),
  include: DepartmentIncludeSchema.optional(),
  data: z.union([ DepartmentCreateInputSchema,DepartmentUncheckedCreateInputSchema ]),
}).strict() ;

export const DepartmentUpsertArgsSchema: z.ZodType<Prisma.DepartmentUpsertArgs> = z.object({
  select: DepartmentSelectSchema.optional(),
  include: DepartmentIncludeSchema.optional(),
  where: DepartmentWhereUniqueInputSchema,
  create: z.union([ DepartmentCreateInputSchema,DepartmentUncheckedCreateInputSchema ]),
  update: z.union([ DepartmentUpdateInputSchema,DepartmentUncheckedUpdateInputSchema ]),
}).strict() ;

export const DepartmentCreateManyArgsSchema: z.ZodType<Prisma.DepartmentCreateManyArgs> = z.object({
  data: z.union([ DepartmentCreateManyInputSchema,DepartmentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DepartmentCreateManyAndReturnArgsSchema: z.ZodType<Prisma.DepartmentCreateManyAndReturnArgs> = z.object({
  data: z.union([ DepartmentCreateManyInputSchema,DepartmentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DepartmentDeleteArgsSchema: z.ZodType<Prisma.DepartmentDeleteArgs> = z.object({
  select: DepartmentSelectSchema.optional(),
  include: DepartmentIncludeSchema.optional(),
  where: DepartmentWhereUniqueInputSchema,
}).strict() ;

export const DepartmentUpdateArgsSchema: z.ZodType<Prisma.DepartmentUpdateArgs> = z.object({
  select: DepartmentSelectSchema.optional(),
  include: DepartmentIncludeSchema.optional(),
  data: z.union([ DepartmentUpdateInputSchema,DepartmentUncheckedUpdateInputSchema ]),
  where: DepartmentWhereUniqueInputSchema,
}).strict() ;

export const DepartmentUpdateManyArgsSchema: z.ZodType<Prisma.DepartmentUpdateManyArgs> = z.object({
  data: z.union([ DepartmentUpdateManyMutationInputSchema,DepartmentUncheckedUpdateManyInputSchema ]),
  where: DepartmentWhereInputSchema.optional(),
}).strict() ;

export const DepartmentDeleteManyArgsSchema: z.ZodType<Prisma.DepartmentDeleteManyArgs> = z.object({
  where: DepartmentWhereInputSchema.optional(),
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserLoginCreateArgsSchema: z.ZodType<Prisma.UserLoginCreateArgs> = z.object({
  select: UserLoginSelectSchema.optional(),
  include: UserLoginIncludeSchema.optional(),
  data: z.union([ UserLoginCreateInputSchema,UserLoginUncheckedCreateInputSchema ]),
}).strict() ;

export const UserLoginUpsertArgsSchema: z.ZodType<Prisma.UserLoginUpsertArgs> = z.object({
  select: UserLoginSelectSchema.optional(),
  include: UserLoginIncludeSchema.optional(),
  where: UserLoginWhereUniqueInputSchema,
  create: z.union([ UserLoginCreateInputSchema,UserLoginUncheckedCreateInputSchema ]),
  update: z.union([ UserLoginUpdateInputSchema,UserLoginUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserLoginCreateManyArgsSchema: z.ZodType<Prisma.UserLoginCreateManyArgs> = z.object({
  data: z.union([ UserLoginCreateManyInputSchema,UserLoginCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserLoginCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserLoginCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserLoginCreateManyInputSchema,UserLoginCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserLoginDeleteArgsSchema: z.ZodType<Prisma.UserLoginDeleteArgs> = z.object({
  select: UserLoginSelectSchema.optional(),
  include: UserLoginIncludeSchema.optional(),
  where: UserLoginWhereUniqueInputSchema,
}).strict() ;

export const UserLoginUpdateArgsSchema: z.ZodType<Prisma.UserLoginUpdateArgs> = z.object({
  select: UserLoginSelectSchema.optional(),
  include: UserLoginIncludeSchema.optional(),
  data: z.union([ UserLoginUpdateInputSchema,UserLoginUncheckedUpdateInputSchema ]),
  where: UserLoginWhereUniqueInputSchema,
}).strict() ;

export const UserLoginUpdateManyArgsSchema: z.ZodType<Prisma.UserLoginUpdateManyArgs> = z.object({
  data: z.union([ UserLoginUpdateManyMutationInputSchema,UserLoginUncheckedUpdateManyInputSchema ]),
  where: UserLoginWhereInputSchema.optional(),
}).strict() ;

export const UserLoginDeleteManyArgsSchema: z.ZodType<Prisma.UserLoginDeleteManyArgs> = z.object({
  where: UserLoginWhereInputSchema.optional(),
}).strict() ;

export const RoleCreateArgsSchema: z.ZodType<Prisma.RoleCreateArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  data: z.union([ RoleCreateInputSchema,RoleUncheckedCreateInputSchema ]),
}).strict() ;

export const RoleUpsertArgsSchema: z.ZodType<Prisma.RoleUpsertArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereUniqueInputSchema,
  create: z.union([ RoleCreateInputSchema,RoleUncheckedCreateInputSchema ]),
  update: z.union([ RoleUpdateInputSchema,RoleUncheckedUpdateInputSchema ]),
}).strict() ;

export const RoleCreateManyArgsSchema: z.ZodType<Prisma.RoleCreateManyArgs> = z.object({
  data: z.union([ RoleCreateManyInputSchema,RoleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RoleCreateManyAndReturnArgsSchema: z.ZodType<Prisma.RoleCreateManyAndReturnArgs> = z.object({
  data: z.union([ RoleCreateManyInputSchema,RoleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RoleDeleteArgsSchema: z.ZodType<Prisma.RoleDeleteArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereUniqueInputSchema,
}).strict() ;

export const RoleUpdateArgsSchema: z.ZodType<Prisma.RoleUpdateArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  data: z.union([ RoleUpdateInputSchema,RoleUncheckedUpdateInputSchema ]),
  where: RoleWhereUniqueInputSchema,
}).strict() ;

export const RoleUpdateManyArgsSchema: z.ZodType<Prisma.RoleUpdateManyArgs> = z.object({
  data: z.union([ RoleUpdateManyMutationInputSchema,RoleUncheckedUpdateManyInputSchema ]),
  where: RoleWhereInputSchema.optional(),
}).strict() ;

export const RoleDeleteManyArgsSchema: z.ZodType<Prisma.RoleDeleteManyArgs> = z.object({
  where: RoleWhereInputSchema.optional(),
}).strict() ;

export const UserRoleCreateArgsSchema: z.ZodType<Prisma.UserRoleCreateArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  include: UserRoleIncludeSchema.optional(),
  data: z.union([ UserRoleCreateInputSchema,UserRoleUncheckedCreateInputSchema ]),
}).strict() ;

export const UserRoleUpsertArgsSchema: z.ZodType<Prisma.UserRoleUpsertArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  include: UserRoleIncludeSchema.optional(),
  where: UserRoleWhereUniqueInputSchema,
  create: z.union([ UserRoleCreateInputSchema,UserRoleUncheckedCreateInputSchema ]),
  update: z.union([ UserRoleUpdateInputSchema,UserRoleUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserRoleCreateManyArgsSchema: z.ZodType<Prisma.UserRoleCreateManyArgs> = z.object({
  data: z.union([ UserRoleCreateManyInputSchema,UserRoleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserRoleCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserRoleCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserRoleCreateManyInputSchema,UserRoleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserRoleDeleteArgsSchema: z.ZodType<Prisma.UserRoleDeleteArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  include: UserRoleIncludeSchema.optional(),
  where: UserRoleWhereUniqueInputSchema,
}).strict() ;

export const UserRoleUpdateArgsSchema: z.ZodType<Prisma.UserRoleUpdateArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  include: UserRoleIncludeSchema.optional(),
  data: z.union([ UserRoleUpdateInputSchema,UserRoleUncheckedUpdateInputSchema ]),
  where: UserRoleWhereUniqueInputSchema,
}).strict() ;

export const UserRoleUpdateManyArgsSchema: z.ZodType<Prisma.UserRoleUpdateManyArgs> = z.object({
  data: z.union([ UserRoleUpdateManyMutationInputSchema,UserRoleUncheckedUpdateManyInputSchema ]),
  where: UserRoleWhereInputSchema.optional(),
}).strict() ;

export const UserRoleDeleteManyArgsSchema: z.ZodType<Prisma.UserRoleDeleteManyArgs> = z.object({
  where: UserRoleWhereInputSchema.optional(),
}).strict() ;

export const PermissionCreateArgsSchema: z.ZodType<Prisma.PermissionCreateArgs> = z.object({
  select: PermissionSelectSchema.optional(),
  include: PermissionIncludeSchema.optional(),
  data: z.union([ PermissionCreateInputSchema,PermissionUncheckedCreateInputSchema ]),
}).strict() ;

export const PermissionUpsertArgsSchema: z.ZodType<Prisma.PermissionUpsertArgs> = z.object({
  select: PermissionSelectSchema.optional(),
  include: PermissionIncludeSchema.optional(),
  where: PermissionWhereUniqueInputSchema,
  create: z.union([ PermissionCreateInputSchema,PermissionUncheckedCreateInputSchema ]),
  update: z.union([ PermissionUpdateInputSchema,PermissionUncheckedUpdateInputSchema ]),
}).strict() ;

export const PermissionCreateManyArgsSchema: z.ZodType<Prisma.PermissionCreateManyArgs> = z.object({
  data: z.union([ PermissionCreateManyInputSchema,PermissionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PermissionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PermissionCreateManyAndReturnArgs> = z.object({
  data: z.union([ PermissionCreateManyInputSchema,PermissionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PermissionDeleteArgsSchema: z.ZodType<Prisma.PermissionDeleteArgs> = z.object({
  select: PermissionSelectSchema.optional(),
  include: PermissionIncludeSchema.optional(),
  where: PermissionWhereUniqueInputSchema,
}).strict() ;

export const PermissionUpdateArgsSchema: z.ZodType<Prisma.PermissionUpdateArgs> = z.object({
  select: PermissionSelectSchema.optional(),
  include: PermissionIncludeSchema.optional(),
  data: z.union([ PermissionUpdateInputSchema,PermissionUncheckedUpdateInputSchema ]),
  where: PermissionWhereUniqueInputSchema,
}).strict() ;

export const PermissionUpdateManyArgsSchema: z.ZodType<Prisma.PermissionUpdateManyArgs> = z.object({
  data: z.union([ PermissionUpdateManyMutationInputSchema,PermissionUncheckedUpdateManyInputSchema ]),
  where: PermissionWhereInputSchema.optional(),
}).strict() ;

export const PermissionDeleteManyArgsSchema: z.ZodType<Prisma.PermissionDeleteManyArgs> = z.object({
  where: PermissionWhereInputSchema.optional(),
}).strict() ;

export const RolePermissionCreateArgsSchema: z.ZodType<Prisma.RolePermissionCreateArgs> = z.object({
  select: RolePermissionSelectSchema.optional(),
  include: RolePermissionIncludeSchema.optional(),
  data: z.union([ RolePermissionCreateInputSchema,RolePermissionUncheckedCreateInputSchema ]),
}).strict() ;

export const RolePermissionUpsertArgsSchema: z.ZodType<Prisma.RolePermissionUpsertArgs> = z.object({
  select: RolePermissionSelectSchema.optional(),
  include: RolePermissionIncludeSchema.optional(),
  where: RolePermissionWhereUniqueInputSchema,
  create: z.union([ RolePermissionCreateInputSchema,RolePermissionUncheckedCreateInputSchema ]),
  update: z.union([ RolePermissionUpdateInputSchema,RolePermissionUncheckedUpdateInputSchema ]),
}).strict() ;

export const RolePermissionCreateManyArgsSchema: z.ZodType<Prisma.RolePermissionCreateManyArgs> = z.object({
  data: z.union([ RolePermissionCreateManyInputSchema,RolePermissionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RolePermissionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.RolePermissionCreateManyAndReturnArgs> = z.object({
  data: z.union([ RolePermissionCreateManyInputSchema,RolePermissionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RolePermissionDeleteArgsSchema: z.ZodType<Prisma.RolePermissionDeleteArgs> = z.object({
  select: RolePermissionSelectSchema.optional(),
  include: RolePermissionIncludeSchema.optional(),
  where: RolePermissionWhereUniqueInputSchema,
}).strict() ;

export const RolePermissionUpdateArgsSchema: z.ZodType<Prisma.RolePermissionUpdateArgs> = z.object({
  select: RolePermissionSelectSchema.optional(),
  include: RolePermissionIncludeSchema.optional(),
  data: z.union([ RolePermissionUpdateInputSchema,RolePermissionUncheckedUpdateInputSchema ]),
  where: RolePermissionWhereUniqueInputSchema,
}).strict() ;

export const RolePermissionUpdateManyArgsSchema: z.ZodType<Prisma.RolePermissionUpdateManyArgs> = z.object({
  data: z.union([ RolePermissionUpdateManyMutationInputSchema,RolePermissionUncheckedUpdateManyInputSchema ]),
  where: RolePermissionWhereInputSchema.optional(),
}).strict() ;

export const RolePermissionDeleteManyArgsSchema: z.ZodType<Prisma.RolePermissionDeleteManyArgs> = z.object({
  where: RolePermissionWhereInputSchema.optional(),
}).strict() ;

export const VendorCreateArgsSchema: z.ZodType<Prisma.VendorCreateArgs> = z.object({
  select: VendorSelectSchema.optional(),
  include: VendorIncludeSchema.optional(),
  data: z.union([ VendorCreateInputSchema,VendorUncheckedCreateInputSchema ]),
}).strict() ;

export const VendorUpsertArgsSchema: z.ZodType<Prisma.VendorUpsertArgs> = z.object({
  select: VendorSelectSchema.optional(),
  include: VendorIncludeSchema.optional(),
  where: VendorWhereUniqueInputSchema,
  create: z.union([ VendorCreateInputSchema,VendorUncheckedCreateInputSchema ]),
  update: z.union([ VendorUpdateInputSchema,VendorUncheckedUpdateInputSchema ]),
}).strict() ;

export const VendorCreateManyArgsSchema: z.ZodType<Prisma.VendorCreateManyArgs> = z.object({
  data: z.union([ VendorCreateManyInputSchema,VendorCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const VendorCreateManyAndReturnArgsSchema: z.ZodType<Prisma.VendorCreateManyAndReturnArgs> = z.object({
  data: z.union([ VendorCreateManyInputSchema,VendorCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const VendorDeleteArgsSchema: z.ZodType<Prisma.VendorDeleteArgs> = z.object({
  select: VendorSelectSchema.optional(),
  include: VendorIncludeSchema.optional(),
  where: VendorWhereUniqueInputSchema,
}).strict() ;

export const VendorUpdateArgsSchema: z.ZodType<Prisma.VendorUpdateArgs> = z.object({
  select: VendorSelectSchema.optional(),
  include: VendorIncludeSchema.optional(),
  data: z.union([ VendorUpdateInputSchema,VendorUncheckedUpdateInputSchema ]),
  where: VendorWhereUniqueInputSchema,
}).strict() ;

export const VendorUpdateManyArgsSchema: z.ZodType<Prisma.VendorUpdateManyArgs> = z.object({
  data: z.union([ VendorUpdateManyMutationInputSchema,VendorUncheckedUpdateManyInputSchema ]),
  where: VendorWhereInputSchema.optional(),
}).strict() ;

export const VendorDeleteManyArgsSchema: z.ZodType<Prisma.VendorDeleteManyArgs> = z.object({
  where: VendorWhereInputSchema.optional(),
}).strict() ;

export const ProductCreateArgsSchema: z.ZodType<Prisma.ProductCreateArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  data: z.union([ ProductCreateInputSchema,ProductUncheckedCreateInputSchema ]),
}).strict() ;

export const ProductUpsertArgsSchema: z.ZodType<Prisma.ProductUpsertArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema,
  create: z.union([ ProductCreateInputSchema,ProductUncheckedCreateInputSchema ]),
  update: z.union([ ProductUpdateInputSchema,ProductUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProductCreateManyArgsSchema: z.ZodType<Prisma.ProductCreateManyArgs> = z.object({
  data: z.union([ ProductCreateManyInputSchema,ProductCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProductCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProductCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProductCreateManyInputSchema,ProductCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProductDeleteArgsSchema: z.ZodType<Prisma.ProductDeleteArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema,
}).strict() ;

export const ProductUpdateArgsSchema: z.ZodType<Prisma.ProductUpdateArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  data: z.union([ ProductUpdateInputSchema,ProductUncheckedUpdateInputSchema ]),
  where: ProductWhereUniqueInputSchema,
}).strict() ;

export const ProductUpdateManyArgsSchema: z.ZodType<Prisma.ProductUpdateManyArgs> = z.object({
  data: z.union([ ProductUpdateManyMutationInputSchema,ProductUncheckedUpdateManyInputSchema ]),
  where: ProductWhereInputSchema.optional(),
}).strict() ;

export const ProductDeleteManyArgsSchema: z.ZodType<Prisma.ProductDeleteManyArgs> = z.object({
  where: ProductWhereInputSchema.optional(),
}).strict() ;

export const ProductDepartmentCreateArgsSchema: z.ZodType<Prisma.ProductDepartmentCreateArgs> = z.object({
  select: ProductDepartmentSelectSchema.optional(),
  include: ProductDepartmentIncludeSchema.optional(),
  data: z.union([ ProductDepartmentCreateInputSchema,ProductDepartmentUncheckedCreateInputSchema ]),
}).strict() ;

export const ProductDepartmentUpsertArgsSchema: z.ZodType<Prisma.ProductDepartmentUpsertArgs> = z.object({
  select: ProductDepartmentSelectSchema.optional(),
  include: ProductDepartmentIncludeSchema.optional(),
  where: ProductDepartmentWhereUniqueInputSchema,
  create: z.union([ ProductDepartmentCreateInputSchema,ProductDepartmentUncheckedCreateInputSchema ]),
  update: z.union([ ProductDepartmentUpdateInputSchema,ProductDepartmentUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProductDepartmentCreateManyArgsSchema: z.ZodType<Prisma.ProductDepartmentCreateManyArgs> = z.object({
  data: z.union([ ProductDepartmentCreateManyInputSchema,ProductDepartmentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProductDepartmentCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProductDepartmentCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProductDepartmentCreateManyInputSchema,ProductDepartmentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProductDepartmentDeleteArgsSchema: z.ZodType<Prisma.ProductDepartmentDeleteArgs> = z.object({
  select: ProductDepartmentSelectSchema.optional(),
  include: ProductDepartmentIncludeSchema.optional(),
  where: ProductDepartmentWhereUniqueInputSchema,
}).strict() ;

export const ProductDepartmentUpdateArgsSchema: z.ZodType<Prisma.ProductDepartmentUpdateArgs> = z.object({
  select: ProductDepartmentSelectSchema.optional(),
  include: ProductDepartmentIncludeSchema.optional(),
  data: z.union([ ProductDepartmentUpdateInputSchema,ProductDepartmentUncheckedUpdateInputSchema ]),
  where: ProductDepartmentWhereUniqueInputSchema,
}).strict() ;

export const ProductDepartmentUpdateManyArgsSchema: z.ZodType<Prisma.ProductDepartmentUpdateManyArgs> = z.object({
  data: z.union([ ProductDepartmentUpdateManyMutationInputSchema,ProductDepartmentUncheckedUpdateManyInputSchema ]),
  where: ProductDepartmentWhereInputSchema.optional(),
}).strict() ;

export const ProductDepartmentDeleteManyArgsSchema: z.ZodType<Prisma.ProductDepartmentDeleteManyArgs> = z.object({
  where: ProductDepartmentWhereInputSchema.optional(),
}).strict() ;

export const IntentTrackCreateArgsSchema: z.ZodType<Prisma.IntentTrackCreateArgs> = z.object({
  select: IntentTrackSelectSchema.optional(),
  include: IntentTrackIncludeSchema.optional(),
  data: z.union([ IntentTrackCreateInputSchema,IntentTrackUncheckedCreateInputSchema ]),
}).strict() ;

export const IntentTrackUpsertArgsSchema: z.ZodType<Prisma.IntentTrackUpsertArgs> = z.object({
  select: IntentTrackSelectSchema.optional(),
  include: IntentTrackIncludeSchema.optional(),
  where: IntentTrackWhereUniqueInputSchema,
  create: z.union([ IntentTrackCreateInputSchema,IntentTrackUncheckedCreateInputSchema ]),
  update: z.union([ IntentTrackUpdateInputSchema,IntentTrackUncheckedUpdateInputSchema ]),
}).strict() ;

export const IntentTrackCreateManyArgsSchema: z.ZodType<Prisma.IntentTrackCreateManyArgs> = z.object({
  data: z.union([ IntentTrackCreateManyInputSchema,IntentTrackCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const IntentTrackCreateManyAndReturnArgsSchema: z.ZodType<Prisma.IntentTrackCreateManyAndReturnArgs> = z.object({
  data: z.union([ IntentTrackCreateManyInputSchema,IntentTrackCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const IntentTrackDeleteArgsSchema: z.ZodType<Prisma.IntentTrackDeleteArgs> = z.object({
  select: IntentTrackSelectSchema.optional(),
  include: IntentTrackIncludeSchema.optional(),
  where: IntentTrackWhereUniqueInputSchema,
}).strict() ;

export const IntentTrackUpdateArgsSchema: z.ZodType<Prisma.IntentTrackUpdateArgs> = z.object({
  select: IntentTrackSelectSchema.optional(),
  include: IntentTrackIncludeSchema.optional(),
  data: z.union([ IntentTrackUpdateInputSchema,IntentTrackUncheckedUpdateInputSchema ]),
  where: IntentTrackWhereUniqueInputSchema,
}).strict() ;

export const IntentTrackUpdateManyArgsSchema: z.ZodType<Prisma.IntentTrackUpdateManyArgs> = z.object({
  data: z.union([ IntentTrackUpdateManyMutationInputSchema,IntentTrackUncheckedUpdateManyInputSchema ]),
  where: IntentTrackWhereInputSchema.optional(),
}).strict() ;

export const IntentTrackDeleteManyArgsSchema: z.ZodType<Prisma.IntentTrackDeleteManyArgs> = z.object({
  where: IntentTrackWhereInputSchema.optional(),
}).strict() ;

export const IntentStatusCreateArgsSchema: z.ZodType<Prisma.IntentStatusCreateArgs> = z.object({
  select: IntentStatusSelectSchema.optional(),
  include: IntentStatusIncludeSchema.optional(),
  data: z.union([ IntentStatusCreateInputSchema,IntentStatusUncheckedCreateInputSchema ]),
}).strict() ;

export const IntentStatusUpsertArgsSchema: z.ZodType<Prisma.IntentStatusUpsertArgs> = z.object({
  select: IntentStatusSelectSchema.optional(),
  include: IntentStatusIncludeSchema.optional(),
  where: IntentStatusWhereUniqueInputSchema,
  create: z.union([ IntentStatusCreateInputSchema,IntentStatusUncheckedCreateInputSchema ]),
  update: z.union([ IntentStatusUpdateInputSchema,IntentStatusUncheckedUpdateInputSchema ]),
}).strict() ;

export const IntentStatusCreateManyArgsSchema: z.ZodType<Prisma.IntentStatusCreateManyArgs> = z.object({
  data: z.union([ IntentStatusCreateManyInputSchema,IntentStatusCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const IntentStatusCreateManyAndReturnArgsSchema: z.ZodType<Prisma.IntentStatusCreateManyAndReturnArgs> = z.object({
  data: z.union([ IntentStatusCreateManyInputSchema,IntentStatusCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const IntentStatusDeleteArgsSchema: z.ZodType<Prisma.IntentStatusDeleteArgs> = z.object({
  select: IntentStatusSelectSchema.optional(),
  include: IntentStatusIncludeSchema.optional(),
  where: IntentStatusWhereUniqueInputSchema,
}).strict() ;

export const IntentStatusUpdateArgsSchema: z.ZodType<Prisma.IntentStatusUpdateArgs> = z.object({
  select: IntentStatusSelectSchema.optional(),
  include: IntentStatusIncludeSchema.optional(),
  data: z.union([ IntentStatusUpdateInputSchema,IntentStatusUncheckedUpdateInputSchema ]),
  where: IntentStatusWhereUniqueInputSchema,
}).strict() ;

export const IntentStatusUpdateManyArgsSchema: z.ZodType<Prisma.IntentStatusUpdateManyArgs> = z.object({
  data: z.union([ IntentStatusUpdateManyMutationInputSchema,IntentStatusUncheckedUpdateManyInputSchema ]),
  where: IntentStatusWhereInputSchema.optional(),
}).strict() ;

export const IntentStatusDeleteManyArgsSchema: z.ZodType<Prisma.IntentStatusDeleteManyArgs> = z.object({
  where: IntentStatusWhereInputSchema.optional(),
}).strict() ;

export const ProductIntentCreateArgsSchema: z.ZodType<Prisma.ProductIntentCreateArgs> = z.object({
  select: ProductIntentSelectSchema.optional(),
  include: ProductIntentIncludeSchema.optional(),
  data: z.union([ ProductIntentCreateInputSchema,ProductIntentUncheckedCreateInputSchema ]),
}).strict() ;

export const ProductIntentUpsertArgsSchema: z.ZodType<Prisma.ProductIntentUpsertArgs> = z.object({
  select: ProductIntentSelectSchema.optional(),
  include: ProductIntentIncludeSchema.optional(),
  where: ProductIntentWhereUniqueInputSchema,
  create: z.union([ ProductIntentCreateInputSchema,ProductIntentUncheckedCreateInputSchema ]),
  update: z.union([ ProductIntentUpdateInputSchema,ProductIntentUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProductIntentCreateManyArgsSchema: z.ZodType<Prisma.ProductIntentCreateManyArgs> = z.object({
  data: z.union([ ProductIntentCreateManyInputSchema,ProductIntentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProductIntentCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProductIntentCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProductIntentCreateManyInputSchema,ProductIntentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProductIntentDeleteArgsSchema: z.ZodType<Prisma.ProductIntentDeleteArgs> = z.object({
  select: ProductIntentSelectSchema.optional(),
  include: ProductIntentIncludeSchema.optional(),
  where: ProductIntentWhereUniqueInputSchema,
}).strict() ;

export const ProductIntentUpdateArgsSchema: z.ZodType<Prisma.ProductIntentUpdateArgs> = z.object({
  select: ProductIntentSelectSchema.optional(),
  include: ProductIntentIncludeSchema.optional(),
  data: z.union([ ProductIntentUpdateInputSchema,ProductIntentUncheckedUpdateInputSchema ]),
  where: ProductIntentWhereUniqueInputSchema,
}).strict() ;

export const ProductIntentUpdateManyArgsSchema: z.ZodType<Prisma.ProductIntentUpdateManyArgs> = z.object({
  data: z.union([ ProductIntentUpdateManyMutationInputSchema,ProductIntentUncheckedUpdateManyInputSchema ]),
  where: ProductIntentWhereInputSchema.optional(),
}).strict() ;

export const ProductIntentDeleteManyArgsSchema: z.ZodType<Prisma.ProductIntentDeleteManyArgs> = z.object({
  where: ProductIntentWhereInputSchema.optional(),
}).strict() ;

export const PatientCreateArgsSchema: z.ZodType<Prisma.PatientCreateArgs> = z.object({
  select: PatientSelectSchema.optional(),
  include: PatientIncludeSchema.optional(),
  data: z.union([ PatientCreateInputSchema,PatientUncheckedCreateInputSchema ]),
}).strict() ;

export const PatientUpsertArgsSchema: z.ZodType<Prisma.PatientUpsertArgs> = z.object({
  select: PatientSelectSchema.optional(),
  include: PatientIncludeSchema.optional(),
  where: PatientWhereUniqueInputSchema,
  create: z.union([ PatientCreateInputSchema,PatientUncheckedCreateInputSchema ]),
  update: z.union([ PatientUpdateInputSchema,PatientUncheckedUpdateInputSchema ]),
}).strict() ;

export const PatientCreateManyArgsSchema: z.ZodType<Prisma.PatientCreateManyArgs> = z.object({
  data: z.union([ PatientCreateManyInputSchema,PatientCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PatientCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PatientCreateManyAndReturnArgs> = z.object({
  data: z.union([ PatientCreateManyInputSchema,PatientCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PatientDeleteArgsSchema: z.ZodType<Prisma.PatientDeleteArgs> = z.object({
  select: PatientSelectSchema.optional(),
  include: PatientIncludeSchema.optional(),
  where: PatientWhereUniqueInputSchema,
}).strict() ;

export const PatientUpdateArgsSchema: z.ZodType<Prisma.PatientUpdateArgs> = z.object({
  select: PatientSelectSchema.optional(),
  include: PatientIncludeSchema.optional(),
  data: z.union([ PatientUpdateInputSchema,PatientUncheckedUpdateInputSchema ]),
  where: PatientWhereUniqueInputSchema,
}).strict() ;

export const PatientUpdateManyArgsSchema: z.ZodType<Prisma.PatientUpdateManyArgs> = z.object({
  data: z.union([ PatientUpdateManyMutationInputSchema,PatientUncheckedUpdateManyInputSchema ]),
  where: PatientWhereInputSchema.optional(),
}).strict() ;

export const PatientDeleteManyArgsSchema: z.ZodType<Prisma.PatientDeleteManyArgs> = z.object({
  where: PatientWhereInputSchema.optional(),
}).strict() ;

export const PatientVisitCreateArgsSchema: z.ZodType<Prisma.PatientVisitCreateArgs> = z.object({
  select: PatientVisitSelectSchema.optional(),
  include: PatientVisitIncludeSchema.optional(),
  data: z.union([ PatientVisitCreateInputSchema,PatientVisitUncheckedCreateInputSchema ]),
}).strict() ;

export const PatientVisitUpsertArgsSchema: z.ZodType<Prisma.PatientVisitUpsertArgs> = z.object({
  select: PatientVisitSelectSchema.optional(),
  include: PatientVisitIncludeSchema.optional(),
  where: PatientVisitWhereUniqueInputSchema,
  create: z.union([ PatientVisitCreateInputSchema,PatientVisitUncheckedCreateInputSchema ]),
  update: z.union([ PatientVisitUpdateInputSchema,PatientVisitUncheckedUpdateInputSchema ]),
}).strict() ;

export const PatientVisitCreateManyArgsSchema: z.ZodType<Prisma.PatientVisitCreateManyArgs> = z.object({
  data: z.union([ PatientVisitCreateManyInputSchema,PatientVisitCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PatientVisitCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PatientVisitCreateManyAndReturnArgs> = z.object({
  data: z.union([ PatientVisitCreateManyInputSchema,PatientVisitCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PatientVisitDeleteArgsSchema: z.ZodType<Prisma.PatientVisitDeleteArgs> = z.object({
  select: PatientVisitSelectSchema.optional(),
  include: PatientVisitIncludeSchema.optional(),
  where: PatientVisitWhereUniqueInputSchema,
}).strict() ;

export const PatientVisitUpdateArgsSchema: z.ZodType<Prisma.PatientVisitUpdateArgs> = z.object({
  select: PatientVisitSelectSchema.optional(),
  include: PatientVisitIncludeSchema.optional(),
  data: z.union([ PatientVisitUpdateInputSchema,PatientVisitUncheckedUpdateInputSchema ]),
  where: PatientVisitWhereUniqueInputSchema,
}).strict() ;

export const PatientVisitUpdateManyArgsSchema: z.ZodType<Prisma.PatientVisitUpdateManyArgs> = z.object({
  data: z.union([ PatientVisitUpdateManyMutationInputSchema,PatientVisitUncheckedUpdateManyInputSchema ]),
  where: PatientVisitWhereInputSchema.optional(),
}).strict() ;

export const PatientVisitDeleteManyArgsSchema: z.ZodType<Prisma.PatientVisitDeleteManyArgs> = z.object({
  where: PatientVisitWhereInputSchema.optional(),
}).strict() ;

export const AssessmentCreateArgsSchema: z.ZodType<Prisma.AssessmentCreateArgs> = z.object({
  select: AssessmentSelectSchema.optional(),
  include: AssessmentIncludeSchema.optional(),
  data: z.union([ AssessmentCreateInputSchema,AssessmentUncheckedCreateInputSchema ]),
}).strict() ;

export const AssessmentUpsertArgsSchema: z.ZodType<Prisma.AssessmentUpsertArgs> = z.object({
  select: AssessmentSelectSchema.optional(),
  include: AssessmentIncludeSchema.optional(),
  where: AssessmentWhereUniqueInputSchema,
  create: z.union([ AssessmentCreateInputSchema,AssessmentUncheckedCreateInputSchema ]),
  update: z.union([ AssessmentUpdateInputSchema,AssessmentUncheckedUpdateInputSchema ]),
}).strict() ;

export const AssessmentCreateManyArgsSchema: z.ZodType<Prisma.AssessmentCreateManyArgs> = z.object({
  data: z.union([ AssessmentCreateManyInputSchema,AssessmentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AssessmentCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AssessmentCreateManyAndReturnArgs> = z.object({
  data: z.union([ AssessmentCreateManyInputSchema,AssessmentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AssessmentDeleteArgsSchema: z.ZodType<Prisma.AssessmentDeleteArgs> = z.object({
  select: AssessmentSelectSchema.optional(),
  include: AssessmentIncludeSchema.optional(),
  where: AssessmentWhereUniqueInputSchema,
}).strict() ;

export const AssessmentUpdateArgsSchema: z.ZodType<Prisma.AssessmentUpdateArgs> = z.object({
  select: AssessmentSelectSchema.optional(),
  include: AssessmentIncludeSchema.optional(),
  data: z.union([ AssessmentUpdateInputSchema,AssessmentUncheckedUpdateInputSchema ]),
  where: AssessmentWhereUniqueInputSchema,
}).strict() ;

export const AssessmentUpdateManyArgsSchema: z.ZodType<Prisma.AssessmentUpdateManyArgs> = z.object({
  data: z.union([ AssessmentUpdateManyMutationInputSchema,AssessmentUncheckedUpdateManyInputSchema ]),
  where: AssessmentWhereInputSchema.optional(),
}).strict() ;

export const AssessmentDeleteManyArgsSchema: z.ZodType<Prisma.AssessmentDeleteManyArgs> = z.object({
  where: AssessmentWhereInputSchema.optional(),
}).strict() ;