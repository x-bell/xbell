import { genPropertyDecorator } from '../utils/index';
import { MetaDataType } from '../constants/index';

export const BeforeEachCase = genPropertyDecorator(MetaDataType.BeforeEachCase);

export const BeforeAll = genPropertyDecorator(MetaDataType.BeforeAll);

export const AfterEachCase = genPropertyDecorator(MetaDataType.AfterEachCase);

export const AfterAll = genPropertyDecorator(MetaDataType.AfterAll);

export const Init = genPropertyDecorator(MetaDataType.Init);

export const Inject = genPropertyDecorator(MetaDataType.Inject);

export const Fixme = genPropertyDecorator(MetaDataType.Fixme);

export const Skip = genPropertyDecorator(MetaDataType.Skip);
