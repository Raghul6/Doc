const { describe, it } = require('node:test')
const assert = require('node:assert')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

describe('Database Tests', () => {
  it('should be able to query users', async () => {
    const users = await prisma.user.findMany()
    assert.ok(users.length >= 3, 'Should have seeded at least 3 users')
    const alice = users.find(u => u.name === 'Alice')
    assert.ok(alice, 'Alice should exist')
  })

  it('should create and share a document', async () => {
    const doc = await prisma.document.create({
      data: {
        title: 'Test Doc',
        content: 'Test content',
        ownerId: 'user_alice'
      }
    })
    
    assert.strictEqual(doc.title, 'Test Doc')

    const permission = await prisma.permission.create({
      data: {
        documentId: doc.id,
        userId: 'user_bob',
        role: 'WRITE'
      }
    })

    assert.strictEqual(permission.userId, 'user_bob')

    // cleanup
    await prisma.document.delete({ where: { id: doc.id } })
  })
})
