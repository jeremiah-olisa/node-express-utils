import mongoose, { ObjectId, Model as SchemaModel } from 'mongoose';

import APIFeatures from '../api/api-features';
import AppError from './app-error';
import { NextFunction } from 'express';

export async function exists<TModel>(
  Model: SchemaModel<TModel, {}, {}, {}>,
  query: {},
  next: NextFunction,
  throwErr: boolean,
  message?: string
) {
  let dataExists = await Model.exists(query);

  if (dataExists && throwErr) {
    throw next(new AppError(message || 'Document was not found.', 400));
  } else {
    return dataExists;
  }
}

async function deleteOne<TModel>(
  Model: SchemaModel<TModel, {}, {}, {}>,
  id: string | ObjectId,
  next: NextFunction,
  message?: string
) {
  const doc = await Model.findOneAndDelete({ _id: id });

  if (!doc) {
    throw next(new AppError(message || 'Document was not found.', 400));
  }

  return doc;
}

async function deleteMany<TModel>(
  Model: SchemaModel<TModel, {}, {}, {}>,
  ids: mongoose.Types.ObjectId[]
) {
  // const _ids = ids.map((id) => new mongoose.Types.ObjectId(id))
  const doc = await Model.deleteMany({
    _id: { $in: ids },
  });

  return doc;
}

async function updateOne<TModel>(
  Model: SchemaModel<TModel, {}, {}, {}>,
  id: string | ObjectId,
  dto: {},
  next: NextFunction,
  message?: string
) {
  // let model = mapper(ValidModel, dto);
  const doc = await Model.findByIdAndUpdate(id, dto, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    throw next(new AppError(message || 'Document was not found.', 400));
  }

  return doc;
}

async function updateSingle<TModel>(
  Model: SchemaModel<TModel, {}, {}, {}>,
  queryObj: {},
  dto: {},
  next: NextFunction,
  message?: string
) {
  // let model = mapper(ValidModel, dto);
  const doc = await Model.findOneAndUpdate(queryObj, dto, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    throw next(new AppError(message || 'Document was not found.', 400));
  }

  return doc;
}

async function updateMany<TModel>(
  Model: SchemaModel<TModel, {}, {}, {}>,
  queryObj: {},
  dto: {},
  next: NextFunction,
  message?: string
) {
  // let model = mapper(ValidModel, dto);
  const doc = await Model.updateMany(queryObj, dto, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    throw next(new AppError(message || 'Document was not found.', 400));
  }

  return doc;
}

async function createOne<TModel>(
  Model: SchemaModel<TModel, {}, {}, {}>,
  dto: {}
) {
  // let model = mapper(ValidModel, dto);
  const doc = await Model.create(dto);

  return doc;
}

async function createMany<TModel>(
  Model: SchemaModel<TModel, {}, {}, {}>,
  dto: Array<{}>
) {
  // let model = mapper(ValidModel, dto);
  const doc = await Model.insertMany(dto);

  return doc;
}

async function getOne<TModel>(
  Model: SchemaModel<TModel, {}, {}, {}>,
  id: string | ObjectId,
  next: NextFunction,
  popOptions?: any,
  select?: {} | string,
  message?: string
) {
  let query: any = Model.findById(id).select(select || {});
  if (popOptions) query = query.populate(popOptions);
  const doc = await query;
  // console.log(query)
  if (!doc) {
    throw next(new AppError(message || 'Document was not found.', 400));
  }

  return doc;
}

async function single<TModel>(
  Model: SchemaModel<TModel, {}, {}, {}>,
  queryObj: {},
  next: NextFunction,
  message?: string,
  select?: {} | string,
  popOptions?: any
) {
  if (typeof select == 'string') select = select.split(',').join(' ');

  let query: any = Model.findOne(queryObj).select(select || {});

  if (popOptions) query = query.populate(popOptions);
  const doc = await query;
  // console.log(query)
  if (!doc) {
    throw next(new AppError(message || 'Document was not found.', 400));
  }

  return doc;
}

async function deleteSingle<TModel>(
  Model: SchemaModel<TModel, {}, {}, {}>,
  queryObj: {},
  next: NextFunction,
  message?: string
) {
  const doc = await Model.deleteOne(queryObj);
  // console.log(query)
  if (!doc) {
    throw next(new AppError(message || 'Document was not found.', 400));
  }

  return { doc, total: await count(Model) };
}

const count = async (Model: SchemaModel<any, {}, {}, {}>, query?: {}) => {
  return await Model.countDocuments(query || {});
};
// if (req.params.tourId) filter = { tour: req.params.tourId };
// To allow for nested GET reviews on tour (hack)

async function getAll<TModel>(
  Model: SchemaModel<TModel, {}, {}, {}>,
  query?: any,
  filter?: {} | string,
  select?: {} | string
) {
  const features = new APIFeatures(
    Model.find(filter || {}).select(select || {}),
    query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await features.query.exec();
  const doc = (await features.query) as mongoose.HydratedDocument<
    TModel,
    {},
    {}
  >[];

  // SEND RESPONSE
  return { doc, total: await count(Model) };
}

export default {
  deleteOne,
  deleteMany,
  deleteSingle,
  updateSingle,
  updateOne,
  updateMany,
  createOne,
  createMany,
  getOne,
  getAll,
  single,
  count,
};
