<template>
  <div class="column-renderer">
    <div class="renderer-header q-mb-md">
      <div class="text-h5 text-primary">{{ session.title }}</div>
      <div class="text-subtitle2 text-grey-7">{{ formatDescription }}</div>
    </div>

    <div class="columns-container">
      <div
        v-for="column in columns"
        :key="column.id"
        class="retro-column"
        @dragover.prevent
        @drop="handleDrop($event, column.id)"
      >
        <q-card class="column-card full-height">
          <q-card-section class="column-header">
            <div class="row items-center">
              <q-icon
                v-if="column.icon"
                :name="column.icon"
                :color="column.color"
                size="sm"
                class="q-mr-sm"
              />
              <div class="text-h6">{{ column.title }}</div>
            </div>
            <div v-if="column.description" class="text-caption text-grey-7">
              {{ column.description }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="column-content">
            <!-- Add Item Button -->
            <q-btn
              v-if="!readonly"
              flat
              dense
              color="primary"
              icon="add"
              label="Add item"
              class="full-width q-mb-md"
              @click="showAddDialog(column.id)"
            />

            <!-- Items List -->
            <div class="items-list" @dragover.prevent="handleListDragOver($event, column.id)">
              <q-card
                v-for="(item, index) in column.items"
                :key="item.id"
                class="item-card q-mb-sm"
                flat
                bordered
                draggable="true"
                @dragstart="handleDragStart($event, item, column.id, index)"
                @dragover.prevent
                @dragenter="handleDragEnter($event, item.id)"
                @dragleave="isDraggingOver = null"
                @dragend="((isDragging = false), (isDraggingOver = null))"
                :class="{ 'drag-over': isDraggingOver === item.id }"
              >
                <q-card-section class="q-pa-sm">
                  <div class="item-content">{{ item.content }}</div>
                  <div class="item-meta row items-center justify-between q-mt-xs">
                    <div class="text-caption text-grey-6">by {{ item.author }}</div>
                    <div class="item-actions row items-center">
                      <q-btn
                        v-if="!readonly"
                        flat
                        dense
                        round
                        size="sm"
                        icon="thumb_up"
                        :color="item.votes > 0 ? 'positive' : 'grey-5'"
                        @click="voteItem(item.id, true)"
                      >
                        <q-badge v-if="item.votes > 0" color="positive" floating>
                          {{ item.votes }}
                        </q-badge>
                      </q-btn>
                      <q-btn
                        v-if="!readonly"
                        flat
                        dense
                        round
                        size="sm"
                        icon="edit"
                        color="grey-6"
                        @click="editItem(item)"
                      />
                      <q-btn
                        v-if="!readonly"
                        flat
                        dense
                        round
                        size="sm"
                        icon="delete"
                        color="negative"
                        @click="deleteItem(item.id)"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Drag/drop visual feedback -->
    <div v-if="isDragging" class="drag-indicator">
      <q-icon name="drag_indicator" size="lg" />
      <div>Drop item here</div>
    </div>

    <!-- Add Item Dialog -->
    <q-dialog v-model="showAddItemDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Add New Item</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newItemContent"
            label="What would you like to share?"
            type="textarea"
            rows="3"
            outlined
            autofocus
            @keyup.ctrl.enter="addItem"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn
            label="Add Item"
            color="primary"
            :disable="!newItemContent.trim()"
            @click="addItem"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Edit Item Dialog -->
    <q-dialog v-model="showEditItemDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Edit Item</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="editItemContent"
            label="Update your item"
            type="textarea"
            rows="3"
            outlined
            autofocus
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn
            label="Update"
            color="primary"
            :disable="!editItemContent.trim()"
            @click="updateItem"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import type { RendererProps, RetroColumn, RetroItem } from '../../../types/renderer.ts'

const props = defineProps<RendererProps>()

const $q = useQuasar()

// Reactive state
const showAddItemDialog = ref(false)
const showEditItemDialog = ref(false)
const newItemContent = ref('')
const editItemContent = ref('')
const currentColumnId = ref('')
const currentEditItem = ref<RetroItem | null>(null)
const isDragging = ref(false)
const isDraggingOver = ref<string | null>(null)
const dragItem = ref<{ item: RetroItem; columnId: string; index: number } | null>(null)

// Computed properties
const formatDescription = computed(() => {
  return props.session.format.description
})

const columns = computed((): RetroColumn[] => {
  if (!props.session.format.config.columns) return []

  // Sort items by order within each column
  return props.session.format.config.columns.map((columnConfig) => {
    const sessionColumn = props.session.columns?.find((c) => c.id === columnConfig.id)
    const items = sessionColumn?.items || []

    // Sort items by order if available, otherwise by index
    const sortedItems = [...items].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))

    return {
      id: columnConfig.id,
      title: columnConfig.title,
      description: columnConfig.description,
      color: columnConfig.color,
      icon: columnConfig.icon,
      items: sortedItems,
    }
  })
})

// Methods
function handleDragStart(event: DragEvent, item: RetroItem, columnId: string, index: number) {
  if (props.readonly) return

  event.dataTransfer?.setData('text/plain', item.id)
  dragItem.value = { item, columnId, index }
  isDragging.value = true
}

function handleListDragOver(event: DragEvent, columnId: string) {
  if (!isDragging.value || props.readonly) return
  event.preventDefault()
}

function handleDragEnter(event: DragEvent, itemId: string) {
  if (!isDragging.value || props.readonly) return
  isDraggingOver.value = itemId
}

function handleDrop(event: DragEvent, targetColumnId: string) {
  if (!dragItem.value || props.readonly) return

  const { item, columnId: sourceColumnId, index: sourceIndex } = dragItem.value
  const targetColumn = columns.value.find((c) => c.id === targetColumnId)

  if (!targetColumn) return

  // Find target index
  let targetIndex = targetColumn.items.length
  if (isDraggingOver.value) {
    const hoverIndex = targetColumn.items.findIndex((i) => i.id === isDraggingOver.value)
    if (hoverIndex !== -1) {
      targetIndex = hoverIndex + 1 // Insert after hovered item
    }
  }

  // Move item
  moveItem(item.id, sourceColumnId, targetColumnId, sourceIndex, targetIndex)

  // Reset drag state
  isDragging.value = false
  isDraggingOver.value = null
  dragItem.value = null
}

function moveItem(
  itemId: string,
  sourceColumnId: string,
  targetColumnId: string,
  sourceIndex: number,
  targetIndex: number,
) {
  // Find source column
  const sourceColumn = columns.value.find((c) => c.id === sourceColumnId)
  if (!sourceColumn) return

  // Find item in source column
  const sourceItemIndex = sourceColumn.items.findIndex((i) => i.id === itemId)
  if (sourceItemIndex === -1) return

  // Remove from source column
  const [item] = sourceColumn.items.splice(sourceItemIndex, 1)

  // Update item's column and order
  const updates: Partial<RetroItem> = {
    column: targetColumnId,
    order: targetIndex,
  }

  // Add to target column at new position
  const targetColumn = columns.value.find((c) => c.id === targetColumnId)
  if (targetColumn) {
    // Adjust order for items after the insertion point
    targetColumn.items.forEach((item, index) => {
      if (index >= targetIndex) {
        item.order = (item.order ?? index) + 1
      }
    })

    // Insert item at target position
    targetColumn.items.splice(targetIndex, 0, {
      ...item,
      ...updates,
    })

    // Notify parent component of update
    props.onItemUpdate?.(itemId, updates)
  }
}

function showAddDialog(columnId: string) {
  currentColumnId.value = columnId
  newItemContent.value = ''
  showAddItemDialog.value = true
}

function addItem() {
  if (!newItemContent.value.trim()) return

  const newItem = {
    content: newItemContent.value.trim(),
    author: 'Current User', // TODO: Get from user context
    votes: 0,
    column: currentColumnId.value,
  }

  props.onItemAdd?.(newItem)
  showAddItemDialog.value = false
  newItemContent.value = ''

  $q.notify({
    color: 'positive',
    message: 'Item added successfully!',
    icon: 'check',
  })
}

function editItem(item: RetroItem) {
  currentEditItem.value = item
  editItemContent.value = item.content
  showEditItemDialog.value = true
}

function updateItem() {
  if (!editItemContent.value.trim() || !currentEditItem.value) return

  props.onItemUpdate?.(currentEditItem.value.id, {
    content: editItemContent.value.trim(),
  })

  showEditItemDialog.value = false
  currentEditItem.value = null
  editItemContent.value = ''

  $q.notify({
    color: 'positive',
    message: 'Item updated successfully!',
    icon: 'check',
  })
}

function deleteItem(itemId: string) {
  $q.dialog({
    title: 'Confirm Delete',
    message: 'Are you sure you want to delete this item?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    props.onItemDelete?.(itemId)
    $q.notify({
      color: 'positive',
      message: 'Item deleted successfully!',
      icon: 'check',
    })
  })
}

function voteItem(itemId: string, increment: boolean) {
  props.onItemVote?.(itemId, increment)
  $q.notify({
    color: 'positive',
    message: increment ? 'Vote added!' : 'Vote removed!',
    icon: increment ? 'thumb_up' : 'thumb_down',
  })
}
</script>

<style scoped>
.column-renderer {
  padding: 16px;
  position: relative;
}

.drag-indicator {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  pointer-events: none;
}

.drag-over {
  border: 2px dashed var(--q-primary) !important;
  background-color: rgba(0, 100, 255, 0.1) !important;
}

.columns-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  min-height: 500px;
}

.retro-column {
  min-height: 500px;
}

.column-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.column-header {
  background-color: var(--q-primary-1);
  border-bottom: 1px solid var(--q-separator-color);
}

.column-content {
  flex: 1;
  overflow-y: auto;
}

.items-list {
  max-height: 400px;
  overflow-y: auto;
}

.item-card {
  transition: all 0.2s ease;
}

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-content {
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.item-meta {
  font-size: 12px;
}

.item-actions {
  gap: 4px;
}

@media (max-width: 768px) {
  .columns-container {
    grid-template-columns: 1fr;
  }

  .column-renderer {
    padding: 8px;
  }
}
</style>
