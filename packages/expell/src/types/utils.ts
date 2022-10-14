export type ConditionType<Type, MatchObject, DefaultObject> = [Type, MatchObject, DefaultObject];

export type ParseConditionType<Received, MatchObject> = 
  MatchObject extends ConditionType<infer NestType, infer NestMatchObject, infer NestDefaultObject>
    ? Received extends NestType
      ? (ParseConditionType<Received, NestMatchObject> & ParseConditionType<Received, NestDefaultObject>)
      : ParseConditionType<Received, NestDefaultObject>
    : MatchObject

export type ConditionResult<Received, Type, MatchObject, DefaultObject> = 
  Received extends Type
    ? ParseConditionType<Received, DefaultObject> & ParseConditionType<Received, MatchObject>
    : ParseConditionType<Received, DefaultObject>
