import { ProjectPhase } from './phase.enum';
import { ProjectStatus } from './status.enum';

export interface RepositoryMetadata {
  description?: string;
  phase?: ProjectPhase;
  status?: ProjectStatus;
  editingId?: string;
  editValues?: Record<string, string>;
}
