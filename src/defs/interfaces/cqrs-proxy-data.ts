import { CqrsProxyMetadata } from './cqrs-proxy-metadata'

export interface CqrsProxyData<T = any> {
  command: string
  payload: T
  metadata: CqrsProxyMetadata
}
