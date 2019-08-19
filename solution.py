class solution(object):

	def __init__(self):
		self.status = 0
		self.ans = None
		self.time = None
		self.length = None
	def serialize(self):
		return {
			'status':self.status,
			'ans':self.ans,
			'time':self.time,
			'length':self.length,
		}