/**
 * Services Barrel Export
 * 
 * Central export point for all services.
 * @layer Layer 2 - Core Services
 * 
 * NOTE: Scanner, parser, tech detector, and metadata extractor services
 * have been migrated to the Node.js backend for direct filesystem access.
 * Frontend now calls backend API via filesystem.service HTTP client.
 */

export * from './filesystem.service';
export * from './metadata-editor.service';
export * from './metadata-persistence.service';
